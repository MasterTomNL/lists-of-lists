import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { List } from './interfaces/list';

@Injectable()
export class ListService {
  constructor( private firestore: AngularFirestore, private userService: UserService ) { }

  /** GET lists */
  get () {
   return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('lists', ref => ref.orderBy('name'))
      .valueChanges({idField: 'id'});
  }

  /** ADD a list */
  add (list: List) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('lists')
      .doc(list.id)
      .set(list)
      .then(res => console.log('list added'), err => alert(err));
  }

  /** UPDATE a list */
  update (id, list: List) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('lists')
      .doc(id)
      .set(list)
      .then(res => console.log('list updated'), err => alert(err));
  }

  /** DELETE a list */
  delete (id) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection("lists")
      .doc(id)
      .delete()
      .then(res => console.log('list updated'), err => alert(err));
  }

  import(items) {
    // Get a new write batch
    const db = this.firestore.firestore;
    var batch = db.batch();

    const listsCol = this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('lists');

    var i = 0;
    items.forEach(item => {
      // firestore batches can only be 500 actions
      if (i > 500) {
        batch.commit().then(() => { console.log('batch saved') });
        batch = db.batch();
        i = 0;
      }
      
      batch.set(
        listsCol.doc(item.id).ref,
        item
      );
      i += 1;
    });

    // Commit the batch
    batch.commit().then(() => { console.log('batch saved') });
  }
}