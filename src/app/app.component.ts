import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, PipeTransform, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbAlert, NgbCalendar, NgbDateStruct, NgbModal, NgbOffcanvas, NgbOffcanvasConfig, NgbTooltipConfig, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge, startWith } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { CountryService } from './country.service';
import { ToastService } from './toast-service';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Juice',
    children: [{ name: 'Banana Shake' }, { name: 'Apple Juice' }, {
      name: 'Gauva',
      children: [{ name: 'Juice' }, { name: 'Lumps ' }],
    },],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'ngbd-modal-confirm',
  standalone: true,
  template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-title">Profile deletion</h4>
			<button
				type="button"
				class="btn-close"
				aria-describedby="modal-title"
				(click)="modal.dismiss('Cross click')"
			></button>
		</div>
		<div class="modal-body">
			<p>
				<strong>Are you sure you want to delete <span class="text-primary">"Anjal Thapa"</span> profile?</strong>
			</p>
			<p>
				All information associated to this user profile will be permanently deleted.
				<span class="text-danger">This operation can not be undone.</span>
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
			<button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
		</div>
	`,
})
export class NgbdModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  standalone: true,
  template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-title">Profile deletion</h4>
			<button
				type="button"
				class="btn-close"
				aria-label="Close button"
				aria-describedby="modal-title"
				(click)="modal.dismiss('Cross click')"
			></button>
		</div>
		<div class="modal-body">
			<p>
				<strong>Are you sure you want to delete <span class="text-primary">"Anjal Thapa"</span> profile?</strong>
			</p>
			<p>
				All information associated to this user profile will be permanently deleted.
				<span class="text-danger">This operation can not be undone.</span>
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
			<button type="button" ngbAutofocus class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
		</div>
	`,
})
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalConfirm,
  autofocus: NgbdModalConfirmAutofocus,
};

interface Country {
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

const states = [
	'Alabama',
	'Alaska',
	'American Samoa',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'District Of Columbia',
	'Federated States Of Micronesia',
	'Florida',
	'Georgia',
	'Guam',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Marshall Islands',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Northern Mariana Islands',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Palau',
	'Pennsylvania',
	'Puerto Rico',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Utah',
	'Vermont',
	'Virgin Islands',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
];

function searchCountry(text: string, pipe: PipeTransform): Country[] {
	return COUNTRIES.filter((country) => {
		const term = text.toLowerCase();
		return (
			country.name.toLowerCase().includes(term) ||
			pipe.transform(country.area).includes(term) ||
			pipe.transform(country.population).includes(term)
		);
	});
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'tree-app2';
  userName: string;
  password: string;
  formData: FormGroup;
  isLoggedIn: boolean = false;
  dateModel: NgbDateStruct;
  date: { year: number; month: number };
  closeResult: string = '';
  currentPage = 3;
  activeNav = 1;
  successMessage = '';
  currentRate = 5;
  selected = 0;
	hovered = 0;
  time = { hour: 13, minute: 30 };
	spinners : boolean = true;
  meridian : boolean = true;
	filter = new FormControl('', { nonNullable: true });
  private _success = new Subject<string>();
  countries$: Observable<Country[]>;
	total$: Observable<number>;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  stateModel: any;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

  /*#region tree functionality  */
  /**
   * transform objects into tree hierarchy
   * @param node 
   * @param level 
   * @returns 
   */
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  /*#endregion */

  withAutofocus = `<button type="button" ngbAutofocus class="btn btn-danger"
  (click)="modal.close('Ok click')">Ok</button>`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private calendar: NgbCalendar,
    private _modalService: NgbModal,
    config: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas,
    private pipe : DecimalPipe,
    public service : CountryService,
    public toastService: ToastService,
	configToolTip: NgbTooltipConfig
  ) {
    this.dataSource.data = TREE_DATA;
    // customize default values of offcanvas used by this component tree
		config.position = 'end';
		config.backdropClass = 'bg-info';
		config.keyboard = false;
    this.countries$ = service.countries$;
	this.total$ = service.total$;

	// customize default values of tooltips used by this component tree
	configToolTip.placement = 'end';
	configToolTip.triggers = 'click';

  }

  ngOnInit() {
    this.formData = new FormGroup({
      userName: new FormControl("admin"),
      password: new FormControl("admin"),
    });
    console.log(this.dateModel);


    this._success.subscribe((message) => (this.successMessage = message));
    this._success.pipe(debounceTime(2000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  onClickSubmit(data: any) {
    this.userName = data.userName;
    this.password = data.password;

    // console.log("Login page: " + this.userName);
    // console.log("Login page: " + this.password);

    this.authService.login(this.userName, this.password)
      .subscribe(data => {
        console.log("Is Login Success: " + data);
        if (data != undefined) this.isLoggedIn = true;

        //  if(data) this.router.navigate(['/expenses']); 
      });
  }

  onClickLogOut() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  selectToday() {
    this.dateModel = this.calendar.getToday();
  }

  openModal(name: string) {
    this._modalService.open(MODALS[name]).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    },
      (reason) => {
        this.closeResult = `Closed with: ${this.getDismissedReason(reason)}`
      });
  }

  private getDismissedReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public changeSuccessMessage() {
		this._success.next(`${new Date()} - Message successfully changed.`);
	}

  openOffCanvas(content : any) {
		this.offcanvasService.open(content, { position : 'start' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    },
      (reason) => {
        this.closeResult = `Closed with: ${this.getDismissedReason(reason)}`
      });
	}

  onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}


  toggleSpinners() {
		this.spinners = !this.spinners;
	}

  toggleMeridian() {
		this.meridian = !this.meridian;
	}


  showStandard() {
		this.toastService.show('I am a standard toast');
	}

	showSuccess() {
		this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(dangerTpl : any) {
		this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
	}

	ngOnDestroy(): void {
		this.toastService.clear();
	}

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
	text$.pipe(
		debounceTime(200),
		distinctUntilChanged(),
		map((term) =>
			term.length < 2 ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
		),
	);
}
