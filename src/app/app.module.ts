import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';

// TODO: Update with actual Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyDh8wu_jn-Hbmf_zRmApAYbcNgFBJA7SLM",
  authDomain: "excella-retro-demo.firebaseapp.com",
  databaseURL: "https://excella-retro-demo.firebaseio.com",
  storageBucket: "excella-retro-demo.appspot.com",
  messagingSenderId: "181383701218"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
