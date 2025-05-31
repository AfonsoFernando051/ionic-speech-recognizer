import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HomePage {
  public myText = "Bom dia!";
  public recording = false;
  public languages: any[] = [];
  public languagesText: string[] = [];
  public idiom: string = 'en-US';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermissions();
    SpeechRecognition.getSupportedLanguages().then((list) => {
      console.log(list.languages);
      this.languages = list.languages;
    });
    TextToSpeech.getSupportedLanguages().then((list) => {
      console.log(list.languages);
      this.languagesText = list.languages;
    });
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();
    if (available) {
      this.recording = true;
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: this.idiom,
      });

      SpeechRecognition.addListener('partialResults', (data: any) => {
        console.log('partial results was fired', data.matches);
        if (data.matches && data.matches.length > 0) {
          this.myText = data.matches[0];
          console.log(this.myText);
          this.changeDetectorRef.detectChanges();
        }
        if (data.value && data.value.length > 0) {
          this.myText = data.value[0];
          console.log(this.myText);
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  public setLanguage(op: number) {
    if (op == 1) {
      this.idiom = 'pt-BR';
    } else {
      this.idiom = 'en-US';
    }
  }

  async stopRecognition() {
    this.recording = false;
    SpeechRecognition.stop();
    SpeechRecognition.removeAllListeners();
  }

  speackText() {
    TextToSpeech.speak({
      text: this.myText,
      lang: this.idiom,
      rate: 1.0,
    });
  }
}
