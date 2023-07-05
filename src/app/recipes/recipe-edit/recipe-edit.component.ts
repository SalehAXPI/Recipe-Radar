import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  editForm: FormGroup;
  private id: number;
  editMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  get ingControls() {
    return (this.editForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit() {
    this.initializeForm();
    this.subscribeToRouteParams();
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
      this.id = +param['id'];
      this.editMode = !!this.id.toString();
      if (this.editMode) this.fillFormInputs();
    });
  }

  private fillFormInputs() {
    const recipeSelected = this.recipeService.getRecipeById(this.id);
    this.editForm.patchValue(recipeSelected);

    const ingredientsArray = recipeSelected.ingredients || [];
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.clear();

    ingredientsArray.forEach((ing) =>
      formIngredientsArray.push(this.createIngredientGroup(ing))
    );
  }

  onAddIngredient() {
    const formIngredientsArray = this.editForm.get('ingredients') as FormArray;
    formIngredientsArray.push(this.createIngredientGroup());
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

  onSubmit() {
    if (this.editForm.invalid) return;

    const recipeFormValue = this.editForm.value;
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, recipeFormValue);
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

  private navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
