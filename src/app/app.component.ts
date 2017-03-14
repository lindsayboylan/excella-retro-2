import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Session } from './models/session';
import { Phase } from './models/phase';
import { Index } from './models/shared/index'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  af;
  sessions: FirebaseListObservable<Session[]>;
  phases: FirebaseListObservable<Phase[]>;
  constructor(af: AngularFire) {
    this.af = af;
    this.sessions = af.database.list('/sessions', {
      query: {
        orderByChild: 'id',
        equalTo: 1
      }
    });
    this.phases = af.database.list('/phases', {
      query: {
        orderByChild: 'sessionId',
        equalTo: 1
      }
    });
  }
  createSession() {
    var sessionId = 1;
    var sessionIndex = new Index(sessionId);
    var phaseId = 2;
    var phaseIndex = new Index(phaseId);
    var phase = new Phase(phaseId, "Phase 1", [], [], sessionId);
    this.phases.push(phase);
    var session = new Session(sessionId, true, 1, 1, [phaseIndex]);
    this.sessions.push(session);
  }
  createNonObservableSession() {
    var sessionId = 2;
    var sessionIndex = new Index(sessionId);
    var phaseId = 3;
    var phaseIndex = new Index(phaseId);
    var phase = new Phase(phaseId, "Phase 2", [], [], sessionId);
    this.phases.push(phase);
    var session = new Session(sessionId, true, 1, 1, [phaseIndex]);
    this.sessions.push(session);
  }
}
