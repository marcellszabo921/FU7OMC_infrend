import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { MachineService } from '../../services/machine.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export default class AdminComponent implements OnInit {
  //company
  users: any[] = [];
  selectedUser: any = null;
  editForm!: FormGroup;
  showEditModal = false;
  //machines
  machines: any[] = [];
  selectedMachine: any = null;
  isEditMachine: boolean = false;
  machineForm!: FormGroup;
  showMachineModal: boolean = false;
  //posts
  posts: any[] = [];
  showModal = false;
  editMode = false;
  selectedPost: any = null;
  postForm!: FormGroup;

  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(MachineService) private machineService: MachineService,
    private postService: PostService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadMachines();
    this.loadPosts();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => this.users = res.data,
      error: (err) => console.error('Hiba userek betöltésekor:', err)
    });
  }

  openEditModalCompany(user: any) {
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

  saveEditCompany() {
    if (!this.selectedUser || !this.editForm.valid) return;

    this.userService.updateUser(this.selectedUser._id, this.editForm.value).subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditModalCompany();
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

  closeEditModalCompany() {
    this.selectedUser = null;
    this.showEditModal = false;
  }

   openEditMachineModal(machine: any) {
    this.selectedMachine = machine;
    this.isEditMachine = true;
    this.machineForm = this.fb.group({
      name: [machine.name],
      type: [machine.type],
      brand: [machine.brand],
      code: [machine.code],
      performance: [machine.performance],
      weight: [machine.weight],
      imageUrl: [machine.imageUrl],
      deposit: [machine.deposit],
      dailyFee: [machine.dailyFee],
    });
    this.showMachineModal = true;
  }

  openMachineModal() {
    this.selectedMachine = null;
    this.isEditMachine = false;
    this.machineForm = this.fb.group({
      name: [''],
      type: [''],
      brand: [''],
      code: [''],
      performance: [0],
      weight: [0],
      imageUrl: [''],
      deposit: [0],
      dailyFee: [0],
    });
    this.showMachineModal = true;
  }

saveMachine() {
  if (!this.machineForm.valid) return;

  if (this.isEditMachine && this.selectedMachine) {
    this.updateMachine();
  } else {
    this.createMachine();
  }
}

createMachine() {
  const formValue = this.machineForm.value;
  console.log("Machine form value:", formValue);

  this.machineService.createMachine(formValue).subscribe({
    next: () => {
      this.loadMachines();
      this.closeMachineModal();
    },
    error: (err) => console.error('Hiba új gép hozzáadásakor:', err)
  });
}

updateMachine() {
  if (!this.selectedMachine) return;

  const formValue = this.machineForm.value;

  this.machineService.updateMachine(this.selectedMachine._id, formValue).subscribe({
    next: () => {
      this.loadMachines();
      this.closeMachineModal();
    },
    error: (err) => console.error('Hiba gép frissítésekor:', err)
  });
}

  deleteMachine(id: string) {
    if (!confirm('Biztosan törlöd ezt a gépet?')) return;

    this.machineService.deleteMachine(id).subscribe({
      next: () => this.loadMachines(),
      error: (err) => console.error('Hiba gép törlésekor:', err)
    });
  }

  closeMachineModal() {
    this.selectedMachine = null;
    this.showMachineModal = false;
  }

  loadMachines() {
    this.machineService.getMachines().subscribe({
      next: (res) => this.machines = res,
      error: (err) => console.error('Hiba gépek betöltésekor:', err)
    });
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (res) => this.posts = res.data,
      error: (err) => console.error('Hiba a posztok betöltésekor:', err)
    });
  }

  openModal(post: any = null) {
    this.editMode = !!post;
    this.selectedPost = post;
    this.showModal = true;
    this.postForm = this.fb.group({
      title: [post?.title],
      content: [post?.content],
      imageUrl: [post?.imageUrl || '']
    });
  }

  savePost() {
    if (this.postForm.invalid) return;

    const data = this.postForm.value;
    if (this.editMode && this.selectedPost) {
      this.postService.updatePost(this.selectedPost._id, data).subscribe(() => {
        this.loadPosts();
        this.closeModal();
      });
    } else {
      this.postService.createPost(data).subscribe(() => {
        this.loadPosts();
        this.closeModal();
      });
    }
  }

  deletePost(id: string) {
    if (confirm('Biztosan törlöd a posztot?')) {
      this.postService.deletePost(id).subscribe(() => this.loadPosts());
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedPost = null;
    this.postForm.reset();
  }
}
