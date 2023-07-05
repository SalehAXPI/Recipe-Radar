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
  public editForm: FormGroup;
  private id: number;
  public editMode: boolean = false;
  recipeIngredients: FormArray;

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
    this.route.params.subscribe((param: Params) => {
      const paramId = param['id'];
      this.editMode = !!paramId;
      this.id = +paramId;
      if (this.editMode) this.fillFormInputs();
      else {
        this.editForm = this.fb.group({
          name: [null, Validators.required],
          imgPath: [null, Validators.required],
          desc: [null, Validators.required],
          ingredients: this.fb.array([
            this.createIngredientGroup({ name: null, amount: null }),
          ]),
        });
      }
    });
  }

  private fillFormInputs() {
    const recipeSelected = this.recipeService.getRecipeById(this.id);
    if (recipeSelected.ingredients) {
      this.recipeIngredients = this.fb.array(
        recipeSelected.ingredients.map((ing) => this.createIngredientGroup(ing))
      );
    }

    this.editForm = this.fb.group({
      name: [
        recipeSelected.name,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      imgPath: [
        recipeSelected.imgPath,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      desc: [
        recipeSelected.desc,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      ingredients:
        this.recipeIngredients ||
        this.createIngredientGroup({ name: null, amount: null }),
    });
  }

  onAddIngredient() {
    (this.editForm.get('ingredients') as FormArray).push(
      this.createIngredientGroup({ name: null, amount: null })
    );
  }

  private createIngredientGroup(ing: { name: any; amount: any }) {
    return this.fb.group({
      name: [
        ing.name ?? null,
        [Validators.required, Validators.pattern('^(?!\\s*$).+')],
      ],
      amount: [ing.amount ?? null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.editForm.value);
    } else {
      this.recipeService.addRecipe(this.editForm.value);
    }

    this.navigateBack();
  }

  onDeleteIng(i: number) {
    (this.editForm.get('ingredients') as FormArray).removeAt(i);
  }

  onCancel() {
    this.navigateBack();
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route }).then((r) => null);
  }
}
