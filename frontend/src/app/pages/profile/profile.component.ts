import { Component, OnInit, inject } from '@angular/core';
import { MachineService } from '../../services/machine.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { RentalService } from '../../services/rental.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [CommonModule]
})
export default class ProfileComponent {
  http = inject(HttpClient);
  authService = inject(AuthService);
  machineService = inject(MachineService);
  rentalService = inject(RentalService);

  machines: any[] = [];
  user: any = null;
  isLoggedIn: boolean = false;
  rentedMachines: any[] = [];
  transactions: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    registerLocaleData(localeHu, 'hu');
    this.loadUser();
    this.getUserRentals();
    this.loadTransactions();
  }


  loadUser() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => {
        console.warn("Nem sikerült betölteni a felhasználót:", err);
      }
    });
  }

  depositToBalance() {
    this.userService.depositToBalance().subscribe({
      next: res => {
        this.user = res.data;
        this.loadTransactions();
        console.log('Sikeres feltöltés:', res);
      },
      error: err => {
        console.error('Hiba történt:', err);
      }
    });
  }

  closeRental(rentalId: string) {
    const endDate = new Date().toISOString();
    const returnedInGoodCondition = confirm("Épségben lett visszahozva a gép?");

    this.rentalService.closeRental({
      id: rentalId,
      endDate: endDate,
      returnedInGoodCondition: returnedInGoodCondition
      
    }).subscribe({
      next: res => {
        this.loadUser();
        this.loadTransactions();
        alert("Bérlés sikeresen lezárva!");
        this.getUserRentals();
      },
      error: err => {
        console.error("Hiba a bérlés lezárásakor:", err);
      }
    });
  }

  getUserRentals() {
    if (!this.authService.isLoggedIn()) return;
    this.rentalService.getUserRentals().subscribe({
      next: res => {
        this.rentedMachines = res.data;
      },
      error: err => {
        console.error("Nem sikerült lekérni a bérléseket:", err);
      }
    });
  }

  loadTransactions() {
    if (!this.authService.isLoggedIn()) return;
    this.rentalService.getUserTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (err) => {
        console.error('Tranzakciók betöltése sikertelen:', err);
      }
    });
  }

  sortByDate(list: any[], dateField: string, direction: 'asc' | 'desc'): any[] {
    return [...list].sort((a, b) => {
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  sortStates: { transactions: 'asc' | 'desc'; rentals: 'asc' | 'desc' } = {
    transactions: 'desc',
    rentals: 'desc',
  };
  
  sortTransactions() {
    this.sortStates.transactions = this.sortStates.transactions === 'asc' ? 'desc' : 'asc';
    this.transactions = this.sortByDate(this.transactions, 'date', this.sortStates.transactions);
  }
  
  sortRentals() {
    this.sortStates.rentals = this.sortStates.rentals === 'asc' ? 'desc' : 'asc';
    this.rentedMachines = this.sortByDate(this.rentedMachines, 'startDate', this.sortStates.rentals);
  }
}
