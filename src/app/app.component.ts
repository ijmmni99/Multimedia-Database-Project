import { Component } from '@angular/core';
import { Task } from './task/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MultimediaDatabaseApp';
  todo = this.store.collection('ImageFile').valueChanges({idField: 'id'});
  audio = this.store.collection('AudioFile').valueChanges({idField: 'id'});
  video = this.store.collection('VideoFile').valueChanges({idField: 'id'});
  doc = this.store.collection('DocFile').valueChanges({idField: 'id'});

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  edit(list: 'ImageFile' | 'AudioFile' | 'VideoFile'| 'DocFile', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        task,
        enableDelete: true
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if(result.delete) {
        this.store.collection(list).doc(task.id).delete();
      }  else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }

  newImage() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {
          type: 'image'
        }
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => this.store.collection('ImageFile').add(result.task));
  }

  newAudio() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {
          type: 'audio'
        }
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => this.store.collection('AudioFile').add(result.task));
  }

  newVideo() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {
          type: 'video'
        }
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => this.store.collection('VideoFile').add(result.task));
  }

  newDoc() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {
          type: 'doc'
        }
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => this.store.collection('DocFile').add(result.task));
  }
}
