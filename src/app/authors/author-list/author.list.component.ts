import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthorService } from 'src/app/_services';
import { Author } from 'src/app/_models';

@Component({
	selector: 'author-list',
	templateUrl: 'author.list.component.html',
	styleUrls: ['author.list.component.css']
})

export class AuthorListComponent implements OnInit {

	// Angular Form and its Controls
	searchForm: FormGroup;
	fields: any = {
		authorsQuery: FormControl
	}

	constructor(
		public authorSrv: AuthorService
	) { }

	ngOnInit(): void {
		// build form fields
		this.fields.authorsQuery = new FormControl('');
		// build Angular Form
		this.searchForm = new FormGroup({ ...this.fields });
		// get all existing authors
		if(!this.authorSrv.authors.length)
			this.authorSrv.find()
				.subscribe(
					console.log,
					console.log
				)
		// values changes listener
		this.fields.authorsQuery.valueChanges
			.pipe(
				debounceTime(1000),
				distinctUntilChanged()
			)
			.subscribe(value => {
				if (value === '')
					// get all existing authors
					this.authorSrv.find()
						.subscribe(
							console.log,
							console.log
						)
				else
					this.authorSrv.query(value)
						.subscribe(
							console.log,
							console.log
						)
			});
	}

	removeAuthor(author: Author) {
		if (confirm('are you sure you want to delete this author?'))
			this.authorSrv.delete('logical', author)
				.subscribe(
					console.log,
					console.log
				);
	}
}
