import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  private id: number = 0;
  private editMode: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      if (param['id']) {
        this.id = param['id'];
        this.editMode = true;
        console.log(this.editMode);

        return;
      }

      this.editMode = false;
      console.log(this.editMode);
    });
  }
}
