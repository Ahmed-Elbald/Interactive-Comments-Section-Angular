import { Component } from "@angular/core";
import { Subject } from "rxjs";

export type DialogComponent = Component & { onSubmit: Subject<boolean> }