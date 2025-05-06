import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export default class AdminComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  editForm!: FormGroup;
  showEditModal = false;

  constructor(@Inject(UserService) private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => this.users = res.data,
      error: (err) => console.error('Hiba userek betöltésekor:', err)
    });
  }

  openEditModal(user: any) {
    this.selectedUser = user;
    this.editForm = this.fb.group({
      firstName: [user.firstName],
      lastName: [user.lastName],
      email: [user.email],
      companyName: [user.companyName],
      taxNumber: [user.taxNumber],
      companyNumber: [user.companyNumber],
      headquarters: [user.headquarters],
      balance: [user.balance],
      isAdmin: [user.isAdmin],
    });
    this.showEditModal = true;
  }

  saveEdit() {
    if (!this.selectedUser || !this.editForm.valid) return;

    this.userService.updateUser(this.selectedUser._id, this.editForm.value).subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditModal();
      },
      error: (err) => console.error('Hiba szerkesztéskor:', err)
    });
  }

  deleteUser(id: string) {
    if (!confirm('Biztosan törlöd ezt a felhasználót?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Hiba törléskor:', err)
    });
  }

  closeEditModal() {
    this.selectedUser = null;
    this.showEditModal = false;
  }
}
