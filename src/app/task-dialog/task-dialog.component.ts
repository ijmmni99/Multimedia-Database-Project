import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../task/task';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  public srcResult: String;
  ref: AngularFireStorageReference;
  tasks: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: string;

  constructor(public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        console.log(this.srcResult);
      };
      
      this.data.task.description = 'test';
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  upload = (event) => {
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/Files/' + randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.tasks = this.ref.put(event.target.files[0]);

    // AngularFireUploadTask provides observable
    // to get uploadProgress value
    this.uploadProgress = this.tasks.snapshotChanges()
    .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

    // observe upload progress
    this.uploadProgress = this.tasks.percentageChanges();
    // get notified when the download URL is available
    this.tasks.then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        this.downloadURL = url;
        this.data.task.description = url;
      })
    })
  }

  cancel(){
    this.dialogRef.close();
  }

}

export interface TaskDialogData {
  task: Task;
  enableDelete: boolean;
}

export interface TaskDialogResult {
  task: Task;
  delete?: boolean;
}

