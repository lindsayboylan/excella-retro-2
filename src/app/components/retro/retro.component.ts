import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Retro } from '../../models/retro';
import { Phase } from '../../models/phase';
import { JoinRetroFormComponent } from '../join-retro-form/join-retro-form.component';
import { ChildComponent } from '../../models/child-component';
import { ChildComponentDirective } from '../../directives/child-component-directive';
import { SubmitFeedbackComponent } from '../phase-steps/submit-feedback/submit-feedback.component';
import { GroupFeedbackComponent } from '../phase-steps/group-feedback/group-feedback.component';
import { VoteFeedbackComponent } from '../phase-steps/vote-feedback/vote-feedback.component';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class RetroComponent implements OnInit {
  retroId: string;
  retroObservable: FirebaseObjectObservable<Retro>;
  private subscription: any;
  private currentPhase: string;
  private currentPhaseId: string;
  private currentPhaseStep: number;
  public user: any;
  public retroSnapshot: any;
  @Input() childComponent: ChildComponent;
  @ViewChild(ChildComponentDirective) childComponentHost: ChildComponentDirective;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private af: AngularFire,
    private componentFactoryResolver: ComponentFactoryResolver,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const self = this;

    this.af.auth.subscribe(user => {
      if(user) {
        self.user = user;
      }
      else {
        self.user = null;
      }
    });

    this.subscription = this.route.params.subscribe(params => self.retroId = params['retroId']);
    this.retroObservable = this.af.database.object('retros/' + self.retroId);
    this.retroObservable.subscribe(retroVal => {
      self.retroSnapshot = retroVal;
      if (self.currentPhaseId !== retroVal.currentPhaseId) {
        self.currentPhaseId = retroVal.currentPhaseId;
        this.af.database.object('phases/' + self.currentPhaseId).subscribe(phaseVal => {
          self.currentPhaseStep = phaseVal.currentPhaseStep;
          this.renderPhaseStep();
        });
      }
    });
  }

  renderPhaseStep() {
    if (this.currentPhaseStep === 1) {
      this.childComponent = new ChildComponent(SubmitFeedbackComponent, this.retroObservable);
    } else if (this.currentPhaseStep === 2) {
      this.childComponent = new ChildComponent(GroupFeedbackComponent, this.retroObservable);
    } else if (this.currentPhaseStep === 3) {
      this.childComponent = new ChildComponent(VoteFeedbackComponent, this.retroObservable);
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.childComponent.component);
    const viewContainerRef = this.childComponentHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ChildComponent>componentRef.instance).data = this.childComponent.data;
  }

  validateUser() {
    var currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId == null) {
      this.router.navigate(['/']);
    }
  }
}
