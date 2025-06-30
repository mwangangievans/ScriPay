import { Component } from '@angular/core';
import { User, UserRole } from './user.interface';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private destroy$ = new Subject<void>()

  // State variables
  searchTerm = ""
  statusFilter = "all"
  entriesPerPage = 10
  currentPage = 1
  isLoading = true
  isMobile = false
  selectedUser: User | null = null
  isSheetOpen = false
  roleLoadingStates: Record<number, boolean> = {}
  openDropdownId: number | null = null

  // Sample data
  sampleUsers: User[] = [
    {
      id: 1,
      user: {
        id: 1,
        email: "admin@gmail.com",
        fullname: "Admin User",
        username: "admin@gmail.com",
        phone_number: "254720460519",
      },
      merchant: {
        id: 1,
        name: "Enterprise Corp",
        email: "enterprise@corp.com",
        location: "New York",
        address: "123 Business Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-17T12:44:04.939417+03:00",
      modified_at: "2025-06-17T12:44:04.939456+03:00",
      profile: null,
      active: false,
    },
    {
      id: 2,
      user: {
        id: 2,
        email: "muindemwangangi2@gmail.com",
        fullname: "Muinde Mwangangi",
        username: "muindemwangangi2@gmail.com",
        phone_number: "254798288410",
      },
      merchant: {
        id: 2,
        name: "Gov Services",
        email: "gov@services.com",
        location: "Canberra",
        address: "456 Government St",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-06-16T12:44:04.939417+03:00",
      modified_at: "2025-06-16T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 3,
      user: {
        id: 3,
        email: "sossy@gmail.com",
        fullname: "Muinde Mwangangi",
        username: "sossy@gmail.com",
        phone_number: "254798288410",
      },
      merchant: {
        id: 3,
        name: "University Corp",
        email: "uni@corp.com",
        location: "Los Angeles",
        address: "789 Campus Dr",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-15T12:44:04.939417+03:00",
      modified_at: "2025-06-15T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 4,
      user: {
        id: 4,
        email: "john.doe@gmail.com",
        fullname: "John Doe",
        username: "john.doe@gmail.com",
        phone_number: "254700123456",
      },
      merchant: {
        id: 4,
        name: "Tech Solutions",
        email: "tech@solutions.com",
        location: "San Francisco",
        address: "101 Tech Way",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-14T12:44:04.939417+03:00",
      modified_at: "2025-06-14T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 5,
      user: {
        id: 5,
        email: "jane.smith@gmail.com",
        fullname: "Jane Smith",
        username: "jane.smith@gmail.com",
        phone_number: "254711234567",
      },
      merchant: {
        id: 5,
        name: "Retail Hub",
        email: "retail@hub.com",
        location: "London",
        address: "202 Market St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-13T12:44:04.939417+03:00",
      modified_at: "2025-06-13T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 6,
      user: {
        id: 6,
        email: "alice.wong@gmail.com",
        fullname: "Alice Wong",
        username: "alice.wong@gmail.com",
        phone_number: "254722345678",
      },
      merchant: {
        id: 6,
        name: "Fashion Boutique",
        email: "fashion@boutique.com",
        location: "Paris",
        address: "303 Style Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-06-12T12:44:04.939417+03:00",
      modified_at: "2025-06-12T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 7,
      user: {
        id: 7,
        email: "bob.jones@gmail.com",
        fullname: "Bob Jones",
        username: "bob.jones@gmail.com",
        phone_number: "254733456789",
      },
      merchant: {
        id: 7,
        name: "Food Mart",
        email: "food@mart.com",
        location: "Tokyo",
        address: "404 Food Lane",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-11T12:44:04.939 417+03:00",
      modified_at: "2025-06-11T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 8,
      user: {
        id: 8,
        email: "emma.brown@gmail.com",
        fullname: "Emma Brown",
        username: "emma.brown@gmail.com",
        phone_number: "254744567890",
      },
      merchant: {
        id: 8,
        name: "Health Clinic",
        email: "health@clinic.com",
        location: "Sydney",
        address: "505 Wellness Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-10T12:44:04.939417+03:00",
      modified_at: "2025-06-10T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 9,
      user: {
        id: 9,
        email: "liam.wilson@gmail.com",
        fullname: "Liam Wilson",
        username: "liam.wilson@gmail.com",
        phone_number: "254755678901",
      },
      merchant: {
        id: 9,
        name: "Auto Repair",
        email: "auto@repair.com",
        location: "Berlin",
        address: "606 Auto St",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-06-09T12:44:04.939417+03:00",
      modified_at: "2025-06-09T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 10,
      user: {
        id: 10,
        email: "olivia.moore@gmail.com",
        fullname: "Olivia Moore",
        username: "olivia.moore@gmail.com",
        phone_number: "254766789012",
      },
      merchant: {
        id: 10,
        name: "Book Store",
        email: "books@store.com",
        location: "Toronto",
        address: "707 Read Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-08T12:44:04.939417+03:00",
      modified_at: "2025-06-08T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 11,
      user: {
        id: 11,
        email: "noah.taylor@gmail.com",
        fullname: "Noah Taylor",
        username: "noah.taylor@gmail.com",
        phone_number: "254777890123",
      },
      merchant: {
        id: 11,
        name: "Gadget Shop",
        email: "gadget@shop.com",
        location: "Singapore",
        address: "808 Tech Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-07T12:44:04.939417+03:00",
      modified_at: "2025-06-07T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 12,
      user: {
        id: 12,
        email: "ava.jackson@gmail.com",
        fullname: "Ava Jackson",
        username: "ava.jackson@gmail.com",
        phone_number: "254788901234",
      },
      merchant: {
        id: 12,
        name: "Pet Store",
        email: "pet@store.com",
        location: "Melbourne",
        address: "909 Pet Lane",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-06-06T12:44:04.939417+03:00",
      modified_at: "2025-06-06T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 13,
      user: {
        id: 13,
        email: "william.white@gmail.com",
        fullname: "William White",
        username: "william.white@gmail.com",
        phone_number: "254799012345",
      },
      merchant: {
        id: 13,
        name: "Coffee Shop",
        email: "coffee@shop.com",
        location: "Seattle",
        address: "1010 Brew St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-05T12:44:04.939417+03:00",
      modified_at: "2025-06-05T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 14,
      user: {
        id: 14,
        email: "sophia.martin@gmail.com",
        fullname: "Sophia Martin",
        username: "sophia.martin@gmail.com",
        phone_number: "254700123456",
      },
      merchant: {
        id: 14,
        name: "Bakery",
        email: "bakery@shop.com",
        location: "Paris",
        address: "1111 Pastry Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-04T12:44:04.939417+03:00",
      modified_at: "2025-06-04T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 15,
      user: {
        id: 15,
        email: "james.lee@gmail.com",
        fullname: "James Lee",
        username: "james.lee@gmail.com",
        phone_number: "254711234567",
      },
      merchant: {
        id: 15,
        name: "Electronics Store",
        email: "electronics@store.com",
        location: "Hong Kong",
        address: "1212 Circuit Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-03T12:44:04.939417+03:00",
      modified_at: "2025-06-03T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 16,
      user: {
        id: 16,
        email: "mia.garcia@gmail.com",
        fullname: "Mia Garcia",
        username: "mia.garcia@gmail.com",
        phone_number: "254722345678",
      },
      merchant: {
        id: 16,
        name: "Flower Shop",
        email: "flower@shop.com",
        location: "Amsterdam",
        address: "1313 Bloom St",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-06-02T12:44:04.939417+03:00",
      modified_at: "2025-06-02T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 17,
      user: {
        id: 17,
        email: "ethan.martinez@gmail.com",
        fullname: "Ethan Martinez",
        username: "ethan.martinez@gmail.com",
        phone_number: "254733456789",
      },
      merchant: {
        id: 17,
        name: "Sports Store",
        email: "sports@store.com",
        location: "Miami",
        address: "1414 Sport Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-06-01T12:44:04.939417+03:00",
      modified_at: "2025-06-01T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 18,
      user: {
        id: 18,
        email: "isabella.hernandez@gmail.com",
        fullname: "Isabella Hernandez",
        username: "isabella.hernandez@gmail.com",
        phone_number: "254744567890",
      },
      merchant: {
        id: 18,
        name: "Jewelry Store",
        email: "jewelry@store.com",
        location: "Dubai",
        address: "1515 Gem Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-31T12:44:04.939417+03:00",
      modified_at: "2025-05-31T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 19,
      user: {
        id: 19,
        email: "mason.lopez@gmail.com",
        fullname: "Mason Lopez",
        username: "mason.lopez@gmail.com",
        phone_number: "254755678901",
      },
      merchant: {
        id: 19,
        name: "Hardware Store",
        email: "hardware@store.com",
        location: "Chicago",
        address: "1616 Tool St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-30T12:44:04.939417+03:00",
      modified_at: "2025-05-30T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 20,
      user: {
        id: 20,
        email: "sophia.gonzalez@gmail.com",
        fullname: "Sophia Gonzalez",
        username: "sophia.gonzalez@gmail.com",
        phone_number: "254766789012",
      },
      merchant: {
        id: 20,
        name: "Toy Store",
        email: "toy@store.com",
        location: "Orlando",
        address: "1717 Play Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-05-29T12:44:04.939417+03:00",
      modified_at: "2025-05-29T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 21,
      user: {
        id: 21,
        email: "logan.wilson@gmail.com",
        fullname: "Logan Wilson",
        username: "logan.wilson@gmail.com",
        phone_number: "254777890123",
      },
      merchant: {
        id: 21,
        name: "Music Store",
        email: "music@store.com",
        location: "Nashville",
        address: "1818 Tune Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-28T12:44:04.939417+03:00",
      modified_at: "2025-05-28T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 22,
      user: {
        id: 22,
        email: "ava.martinez@gmail.com",
        fullname: "Ava Martinez",
        username: "ava.martinez@gmail.com",
        phone_number: "254788901234",
      },
      merchant: {
        id: 22,
        name: "Art Gallery",
        email: "art@gallery.com",
        location: "Florence",
        address: "1919 Canvas St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-27T12:44:04.939417+03:00",
      modified_at: "2025-05-27T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 23,
      user: {
        id: 23,
        email: "elijah.jackson@gmail.com",
        fullname: "Elijah Jackson",
        username: "elijah.jackson@gmail.com",
        phone_number: "254799012345",
      },
      merchant: {
        id: 23,
        name: "Fitness Center",
        email: "fitness@center.com",
        location: "Miami",
        address: "2020 Gym Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-26T12:44:04.939417+03:00",
      modified_at: "2025-05-26T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 24,
      user: {
        id: 24,
        email: "charlotte.white@gmail.com",
        fullname: "Charlotte White",
        username: "charlotte.white@gmail.com",
        phone_number: "254700123456",
      },
      merchant: {
        id: 24,
        name: "Spa Center",
        email: "spa@center.com",
        location: "Bali",
        address: "2121 Relax Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-25T12:44:04.939417+03:00",
      modified_at: "2025-05-25T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 25,
      user: {
        id: 25,
        email: "benjamin.lee@gmail.com",
        fullname: "Benjamin Lee",
        username: "benjamin.lee@gmail.com",
        phone_number: "254711234567",
      },
      merchant: {
        id: 25,
        name: "Tech Repair",
        email: "tech@repair.com",
        location: "Austin",
        address: "2222 Fix St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-24T12:44:04.939417+03:00",
      modified_at: "2025-05-24T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 26,
      user: {
        id: 26,
        email: "amelia.moore@gmail.com",
        fullname: "Amelia Moore",
        username: "amelia.moore@gmail.com",
        phone_number: "254722345678",
      },
      merchant: {
        id: 26,
        name: "Vintage Shop",
        email: "vintage@shop.com",
        location: "London",
        address: "2323 Retro Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: false,
      },
      created_at: "2025-05-23T12:44:04.939417+03:00",
      modified_at: "2025-05-23T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 27,
      user: {
        id: 27,
        email: "lucas.brown@gmail.com",
        fullname: "Lucas Brown",
        username: "lucas.brown@gmail.com",
        phone_number: "254733456789",
      },
      merchant: {
        id: 27,
        name: "Organic Market",
        email: "organic@market.com",
        location: "Portland",
        address: "2424 Green St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-22T12:44:04.939417+03:00",
      modified_at: "2025-05-22T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 28,
      user: {
        id: 28,
        email: "harper.taylor@gmail.com",
        fullname: "Harper Taylor",
        username: "harper.taylor@gmail.com",
        phone_number: "254744567890",
      },
      merchant: {
        id: 28,
        name: "Craft Store",
        email: "craft@store.com",
        location: "Austin",
        address: "2525 Art Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-21T12:44:04.939417+03:00",
      modified_at: "2025-05-21T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 29,
      user: {
        id: 29,
        email: "henry.wilson@gmail.com",
        fullname: "Henry Wilson",
        username: "henry.wilson@gmail.com",
        phone_number: "254755678901",
      },
      merchant: {
        id: 29,
        name: "Bike Shop",
        email: "bike@shop.com",
        location: "Amsterdam",
        address: "2626 Cycle Rd",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-20T12:44:04.939417+03:00",
      modified_at: "2025-05-20T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 30,
      user: {
        id: 30,
        email: "evelyn.martin@gmail.com",
        fullname: "Evelyn Martin",
        username: "evelyn.martin@gmail.com",
        phone_number: "254766789012",
      },
      merchant: {
        id: 30,
        name: "Yoga Studio",
        email: "yoga@studio.com",
        location: "Bali",
        address: "2727 Zen St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-19T12:44:04.939417+03:00",
      modified_at: "2025-05-19T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 31,
      user: {
        id: 31,
        email: "jack.jackson@gmail.com",
        fullname: "Jack Jackson",
        username: "jack.jackson@gmail.com",
        phone_number: "254777890123",
      },
      merchant: {
        id: 31,
        name: "Camping Gear",
        email: "camp@gear.com",
        location: "Denver",
        address: "2828 Outdoor Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-18T12:44:04.939417+03:00",
      modified_at: "2025-05-18T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 32,
      user: {
        id: 32,
        email: "lily.white@gmail.com",
        fullname: "Lily White",
        username: "lily.white@gmail.com",
        phone_number: "254788901234",
      },
      merchant: {
        id: 32,
        name: "Vegan Cafe",
        email: "vegan@cafe.com",
        location: "Portland",
        address: "2929 Plant St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-17T12:44:04.939417+03:00",
      modified_at: "2025-05-17T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 33,
      user: {
        id: 33,
        email: "owen.martinez@gmail.com",
        fullname: "Owen Martinez",
        username: "owen.martinez@gmail.com",
        phone_number: "254799012345",
      },
      merchant: {
        id: 33,
        name: "Pet Grooming",
        email: "groom@pet.com",
        location: "San Diego",
        address: "3030 Fur Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-16T12:44:04.939417+03:00",
      modified_at: "2025-05-16T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 34,
      user: {
        id: 34,
        email: "hazel.lee@gmail.com",
        fullname: "Hazel Lee",
        username: "hazel.lee@gmail.com",
        phone_number: "254700123456",
      },
      merchant: {
        id: 34,
        name: "Antique Store",
        email: "antique@store.com",
        location: "London",
        address: "3131 Old St",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-15T12:44:04.939417+03:00",
      modified_at: "2025-05-15T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
    {
      id: 35,
      user: {
        id: 35,
        email: "leo.garcia@gmail.com",
        fullname: "Leo Garcia",
        username: "leo.garcia@gmail.com",
        phone_number: "254711234567",
      },
      merchant: {
        id: 35,
        name: "Craft Beer",
        email: "beer@craft.com",
        location: "Portland",
        address: "3232 Brew Ave",
        logo: "/placeholder.svg?height=40&width=40",
        active: true,
      },
      created_at: "2025-05-14T12:44:04.939417+03:00",
      modified_at: "2025-05-14T12:44:04.939456+03:00",
      profile: null,
      active: true,
    },
  ]

  userRoles: UserRole[] = [
    {
      id: 1,
      user: {
        id: 1,
        email: "admin@gmail.com",
        phone_number: "254720460519",
        fullname: "admin",
      },
      role: {
        id: 2,
        created_at: "2025-06-16T11:45:17.322478+03:00",
        modified_at: "2025-06-16T11:45:17.322498+03:00",
        name: "System Admin",
        access: "Internal",
        status: true,
        merchant: null,
      },
      created_at: "2025-06-16T22:25:52.540561+03:00",
      modified_at: "2025-06-16T22:25:52.540593+03:00",
      status: true,
      assigned_by: 1,
    },
    {
      id: 2,
      user: {
        id: 1,
        email: "admin@gmail.com",
        phone_number: "254720460519",
        fullname: "admin",
      },
      role: {
        id: 1,
        created_at: "2025-06-16T11:45:17.317622+03:00",
        modified_at: "2025-06-16T11:45:17.317655+03:00",
        name: "Merchant Admin",
        access: "External",
        status: true,
        merchant: null,
      },
      created_at: "2025-06-16T22:31:04.306214+03:00",
      modified_at: "2025-06-16T22:31:04.306248+03:00",
      status: true,
      assigned_by: 1,
    },
    // Add more sample roles as needed...
  ]

  ngOnInit() {
    this.checkMobile()
    window.addEventListener("resize", () => this.checkMobile())

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false
    }, 1000)

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown-container")) {
        this.openDropdownId = null
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    window.removeEventListener("resize", () => this.checkMobile())
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768
  }

  get filteredUsers(): User[] {
    return this.sampleUsers.filter((user) => {
      const matchesSearch =
        user.user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.user.email.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus =
        this.statusFilter === "all" ||
        (this.statusFilter === "active" && user.active) ||
        (this.statusFilter === "inactive" && !user.active)

      return matchesSearch && matchesStatus
    })
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.entriesPerPage)
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.entriesPerPage
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.entriesPerPage, this.filteredUsers.length)
  }

  get paginatedUsers(): User[] {
    return this.filteredUsers.slice(this.startIndex, this.startIndex + this.entriesPerPage)
  }

  getUserRoles(userId: number): UserRole[] {
    return this.userRoles.filter((roleEntry) => roleEntry.user.id === userId)
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  handleViewUser(user: User) {
    this.selectedUser = user
    this.isSheetOpen = true
  }

  closeSheet() {
    this.isSheetOpen = false
    this.selectedUser = null
  }

  toggleDropdown(userId: number) {
    this.openDropdownId = this.openDropdownId === userId ? null : userId
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement
    this.statusFilter = target.value
    this.currentPage = 1
  }

  onEntriesPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement
    this.entriesPerPage = Number(target.value)
    this.currentPage = 1
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.searchTerm = target.value
    this.currentPage = 1
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }

  getPageNumbers(): number[] {
    const pages = []
    const maxPages = Math.min(5, this.totalPages)
    for (let i = 1; i <= maxPages; i++) {
      pages.push(i)
    }
    return pages
  }

  async toggleRoleStatus(roleId: number, currentStatus: boolean) {
    this.roleLoadingStates[roleId] = true

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const roleIndex = this.userRoles.findIndex((role) => role.id === roleId)
      if (roleIndex !== -1) {
        this.userRoles[roleIndex].status = !currentStatus
        this.userRoles[roleIndex].modified_at = new Date().toISOString()
      }

      console.log(`Role ${roleId} status changed to: ${!currentStatus}`)
    } catch (error) {
      console.error("Error updating role status:", error)
    } finally {
      delete this.roleLoadingStates[roleId]
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Action handlers
  onEditUser(user: User) {
    console.log("Edit user:", user)
    this.openDropdownId = null
    // Implement edit user logic
  }

  onAssignRole(user: User) {
    console.log("Assign role to user:", user)
    this.openDropdownId = null
    // Implement assign role logic
  }

  onDeleteUser(user: User) {
    console.log("Delete user:", user)
    this.openDropdownId = null
    // Implement delete user logic
  }

  onAddNewUser() {
    console.log("Add new user")
    // Implement add new user logic
  }

  onExportData() {
    console.log("Export data")
    // Implement export logic
  }
}
