import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeServiceService } from './services/employee-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'crud-app';

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'package',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeServiceService
  ) {}

  ngOnInit() {
    this.getEmployeeList();
  }

  openAddEditEmpForm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const dialogRef = this._dialog.open(EmpAddEditComponent,dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if(data == true){
        this.getEmployeeList();
      console.log("Hello");
      }
    });
  }

  openEditForm(data:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    const dialogRef = this._dialog.open(EmpAddEditComponent,dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if(data == true){
        this.getEmployeeList();
      }
    });
  }

  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteAEmployee(id:any){
    console.log(id);
    return this._empService.deleteAEmployee(id).subscribe({
      next: (res)=>{
        alert("Employee Deleted Successfully");
        this.getEmployeeList();
      },
      error:(err) => {
        console.log(err);
      }
    });
  }


}
