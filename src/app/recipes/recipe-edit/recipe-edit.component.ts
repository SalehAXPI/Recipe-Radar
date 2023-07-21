import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { CommonModule } from '@angular/common';

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
    private recipeService: RecipeService
  ) {}

  get ingControls() {
    return (this.editForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit() {
    this.initializeForm();
    if (this.recipeService.getRecipes().length !== 0) {
      this.subscribeToRouteParams();
    } else {
      this.recipeService.recipeChanged.subscribe(() => {
        this.subscribeToRouteParams();
      });
    }
  }

  onAddIngredient() {
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.push(this.createIngredientGroup());
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    const recipeFormValue = this.editForm.value;
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id! - 1, recipeFormValue);
    } else {
      this.recipeService.addRecipe(recipeFormValue);
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
    const recipeSelected = this.recipeService.getRecipeById(this.id! - 1);
    this.editForm.patchValue(recipeSelected);

    const ingredientsArray = recipeSelected?.ingredients || [];
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
