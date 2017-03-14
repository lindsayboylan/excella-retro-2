import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Session } from './models/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  af;
  sessions: FirebaseListObservable<Session[]>;
  constructor(af: AngularFire) {
    this.af = af;
    this.sessions = af.database.list('/sessions');
  }
  createSession() {
    this.sessions.push(new Session(1, true, 1, 1, []));
  }
}
