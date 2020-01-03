import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HeroesComponent } from "./heroes/heroes.component";
import { HeroDetailComponent } from "./hero-detail/hero-detail.component";
import { ImageDashboardComponent } from "./image/dashboard/dashboard.component";
import { PreviewComponent } from "./image/preview/preview.component";
import { PanelComponent } from './image/panel/panel.component';

const routes: Routes = [
  { path: "heroes", component: HeroesComponent },
  { path: "detail/:id", component: HeroDetailComponent },
  {
    path: "image",
    component: ImageDashboardComponent
  },
  {
    path: "image/:id",
    component: PanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
