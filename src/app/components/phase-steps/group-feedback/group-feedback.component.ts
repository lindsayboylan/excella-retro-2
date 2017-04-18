import { Component, Input, OnInit, OnDestroy, } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';
import { Retro } from '../../../models/retro';
import { Group } from '../../../models/group';
import { Message } from '../../../models/message';
import { ChildComponentData } from '../../../models/child-component-data';

@Component({
  selector: 'app-group-feedback',
  templateUrl: './group-feedback.component.html',
  styleUrls: ['./group-feedback.component.css']
})
export class GroupFeedbackComponent implements OnInit, OnDestroy {
  @Input() data: ChildComponentData;
  retroSubscription: Subscription;
  feedbackSubscription: Subscription;
  groupsSubscription: Subscription;
  retroObservable: FirebaseObjectObservable<Retro>;
  retro: Retro;
  retroId: string;
  feedbackMessagesObservable: FirebaseListObservable<Message[]>;
  groupsObservable: FirebaseListObservable<Group[]>;
  feedbackMessages: Message[];
  ungroupedFeedbackMessages: Message[];
  groups: Group[];

  constructor(private af: AngularFire) { }

  ngOnInit() {
    const self = this;

    this.retroSubscription = this.data.retroObservable.subscribe(retroVal => {
      self.retroId = retroVal.$key;

      self.feedbackMessagesObservable = self.af.database.list('/messages', {
        query: {
          orderByChild: 'retroId',
          equalTo: self.retroId
        }
      });
      self.feedbackSubscription = self.feedbackMessagesObservable.subscribe(feedbackMessages => {
        self.feedbackMessages = feedbackMessages;
        self.ungroupedFeedbackMessages = feedbackMessages.filter(feedback => {
          return feedback.groupId === null || feedback.groupId === undefined;
        });
      });

      self.groupsObservable = self.af.database.list('/groups', {
        query: {
          orderByChild: 'retroId',
          equalTo: self.retroId
        }
      });
      this.groupsSubscription = self.groupsObservable.subscribe(groups => {
        self.groups = groups;
      });
    });
  }

  ngOnDestroy() {
    this.retroSubscription.unsubscribe();
    this.feedbackSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
  }

}
