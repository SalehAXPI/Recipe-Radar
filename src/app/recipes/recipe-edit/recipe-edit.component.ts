import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { addRecipe, updateRecipe } from '../store/recipe.actions';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  editForm!: FormGroup;
  editMode: boolean = false;
  private id!: number | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) {}

  get ingControls() {
    return (this.editForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit() {
    this.initializeForm();
  }

  onAddIngredient() {
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.push(this.createIngredientGroup());
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    const recipeFormValue = this.editForm.value;
    if (this.editMode) {
      this.store.dispatch(
        updateRecipe({ index: this.id! - 1, updatedRecipe: recipeFormValue })
      );
    } else {
      this.store.dispatch(addRecipe({ recipeToAdd: recipeFormValue }));
    }

    this.navigateBack();
  }

  onDeleteIng(index: number) {
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.removeAt(index);
  }

  onCancel() {
    this.navigateBack();
  }

  private initializeForm() {
    this.editForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('^(?!\\s*$).+')]],
      imgPath: [
        null,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      desc: [null, [Validators.required, Validators.pattern('^(?!\\s*$).+')]],
      ingredients: this.fb.array([this.createIngredientGroup()]),
    });
  }

  private subscribeToRouteParams() {
    this.route.params.subscribe((param: Params) => {
      this.id = param['id'] ? +param['id'] : null;
      this.editMode = !!this.id;
      if (this.editMode) this.fillFormInputs();
    });
  }

  private fillFormInputs() {
    let recipeSelected: Recipe;
    this.store
      .select((state) => state.recipes.recipes)
      .subscribe((recipes) => {
        recipeSelected = recipes[this.id! - 1];
      });
    if (!recipeSelected!) return;

    this.editForm.patchValue(recipeSelected);

    const ingredientsArray = recipeSelected.ingredients || [];
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.clear();

    ingredientsArray.forEach((ing) =>
      formIngredientsArray.push(this.createIngredientGroup(ing))
    );
  }

  private createIngredientGroup(
    ing: { name: any; amount: any } = { name: null, amount: null }
  ) {
    return this.fb.group({
      name: [
        ing.name,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      amount: [ing.amount, [Validators.required, Validators.min(1)]],
    });
  }

  private navigateBack() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
