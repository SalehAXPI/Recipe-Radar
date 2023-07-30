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
import { addRecipe, updateRecipe } from '../store/recipe.actions';
import { Recipe } from '../recipe.model';

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
  recipeSelected: (Recipe | undefined) | null;

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
    this.route.params.subscribe((param: Params) => {
      this.id = param['id'] ? +param['id'] : null;
      if (this.id) {
        this.editMode = true;
        this.fillFormInputs();
      } else {
        this.recipeSelected = null;
        this.editMode = false;
        this.initializeForm();
      }
    });
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

  private fillFormInputs() {
    this.store
      .select((state) => state.recipes.recipes)
      .subscribe((recipes) => {
        if (!recipes[this.id! - 1]) return;

        this.recipeSelected = recipes[this.id! - 1];

        this.initializeForm();
        this.editForm.patchValue(this.recipeSelected);

        const ingredientsArray = this.recipeSelected.ingredients || [];
        const formIngredientsArray = this.editForm.get(
          'ingredients'
        ) as FormArray;
        formIngredientsArray.clear();

        ingredientsArray.forEach((ing) =>
          formIngredientsArray.push(this.createIngredientGroup(ing))
        );
      });
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
