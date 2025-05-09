import { Component, OnInit, inject } from '@angular/core';
import { MachineService } from '../../services/machine.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { RentalService } from '../../services/rental.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rent',
  standalone: true,
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css'],
  imports: [CommonModule]
})
export default class RentComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  machineService = inject(MachineService);
  rentalService = inject(RentalService);

  machines: any[] = [];
  user: any = null;
  isLoggedIn: boolean = false;

  user$!: Observable<any>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadMachines();
    this.loadUser();
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

  loadMachines() {
    this.machineService.getMachines().subscribe({
      next: (data) => {
        this.machines = data;
      },
      error: (err) => {
        console.error('Machine fetch error:', err);
      }
    });
  }
  
  rentMachine(machineId: string) {
    if (!this.authService.isLoggedIn()) {
      console.error("Nincs bejelentkezett felhasználó");
      return;
    }

    const rentalData = {
      machineId: machineId,
      startDate: new Date().toISOString(),
    };

    this.rentalService.createRental(rentalData).subscribe({
      next: res => {
        this.user = res.data;
        alert("Bérlés sikeres!");
      },
      error: (err) => {
        alert("Hiba történt a bérlés során. Kérjük, ellenőrizze egyenlegét!");
      }
    });
  }

  depositToBalance() {
    this.userService.depositToBalance().subscribe({
      next: res => {
        this.user = res.data;
        console.log('Sikeres feltöltés:', res);
      },
      error: err => {
        console.error('Hiba történt:', err);
      }
    });
  }
  
  
}
