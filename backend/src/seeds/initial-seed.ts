import { DataSource } from 'typeorm';
import { Household } from '../entities/household.entity';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import * as bcrypt from 'bcrypt';

export class InitialSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('Starting initial seed...');

    // Create Household
    const householdRepo = this.dataSource.getRepository(Household);
    const existingHousehold = await householdRepo.findOne({
      where: { name: 'Family' },
    });

    let household: Household;
    if (!existingHousehold) {
      household = householdRepo.create({
        name: 'Family',
      });
      household = await householdRepo.save(household);
      console.log('Created household: Family');
    } else {
      household = existingHousehold;
      console.log('Household "Family" already exists');
    }

    // Create Users
    const userRepo = this.dataSource.getRepository(User);
    const users = [
      {
        email: 'john@family.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        settings: { theme: 'light', notifications: true },
      },
      {
        email: 'jane@family.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Doe',
        settings: { theme: 'dark', notifications: false },
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepo.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = userRepo.create({
          email: userData.email,
          password_hash: hashedPassword,
          first_name: userData.first_name,
          last_name: userData.last_name,
          settings: userData.settings,
          household_id: household.id,
        });
        await userRepo.save(user);
        console.log(
          `Created user: ${userData.first_name} ${userData.last_name}`,
        );
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }

    // Create Default Categories
    const categoryRepo = this.dataSource.getRepository(Category);
    const categories = [
      // Income Categories
      {
        name: 'Income',
        description: 'All income sources',
        color: '#22c55e',
        icon: 'money-bill-wave',
        parent_id: null,
        children: [
          {
            name: 'Salary',
            description: 'Regular employment income',
            color: '#16a34a',
            icon: 'briefcase',
          },
          {
            name: 'Freelance',
            description: 'Freelance or contract work',
            color: '#15803d',
            icon: 'laptop',
          },
          {
            name: 'Investment',
            description: 'Investment returns and dividends',
            color: '#166534',
            icon: 'chart-line',
          },
        ],
      },
      // Expense Categories
      {
        name: 'Housing',
        description: 'Home-related expenses',
        color: '#3b82f6',
        icon: 'home',
        parent_id: null,
        children: [
          {
            name: 'Rent/Mortgage',
            description: 'Monthly housing payments',
            color: '#2563eb',
            icon: 'home',
          },
          {
            name: 'Utilities',
            description: 'Electric, gas, water, internet',
            color: '#1d4ed8',
            icon: 'bolt',
          },
          {
            name: 'Maintenance',
            description: 'Home repairs and maintenance',
            color: '#1e40af',
            icon: 'wrench',
          },
        ],
      },
      {
        name: 'Food',
        description: 'Food and dining expenses',
        color: '#f59e0b',
        icon: 'utensils',
        parent_id: null,
        children: [
          {
            name: 'Groceries',
            description: 'Food shopping and household items',
            color: '#d97706',
            icon: 'shopping-cart',
          },
          {
            name: 'Dining Out',
            description: 'Restaurants and takeout',
            color: '#b45309',
            icon: 'utensils',
          },
        ],
      },
      {
        name: 'Transportation',
        description: 'Vehicle and travel expenses',
        color: '#8b5cf6',
        icon: 'car',
        parent_id: null,
        children: [
          {
            name: 'Gas',
            description: 'Fuel for vehicles',
            color: '#7c3aed',
            icon: 'gas-pump',
          },
          {
            name: 'Public Transit',
            description: 'Bus, train, rideshare',
            color: '#6d28d9',
            icon: 'bus',
          },
          {
            name: 'Car Maintenance',
            description: 'Vehicle repairs and maintenance',
            color: '#5b21b6',
            icon: 'wrench',
          },
        ],
      },
      {
        name: 'Entertainment',
        description: 'Recreation and entertainment',
        color: '#ec4899',
        icon: 'film',
        parent_id: null,
        children: [
          {
            name: 'Streaming Services',
            description: 'Netflix, Spotify, etc.',
            color: '#db2777',
            icon: 'play',
          },
          {
            name: 'Movies & Events',
            description: 'Cinema, concerts, shows',
            color: '#be185d',
            icon: 'ticket',
          },
          {
            name: 'Games & Hobbies',
            description: 'Gaming, books, hobbies',
            color: '#9d174d',
            icon: 'gamepad',
          },
        ],
      },
      {
        name: 'Healthcare',
        description: 'Medical and health expenses',
        color: '#ef4444',
        icon: 'heart',
        parent_id: null,
        children: [
          {
            name: 'Insurance',
            description: 'Health insurance premiums',
            color: '#dc2626',
            icon: 'shield',
          },
          {
            name: 'Medical Bills',
            description: 'Doctor visits, prescriptions',
            color: '#b91c1c',
            icon: 'stethoscope',
          },
        ],
      },
      {
        name: 'Savings',
        description: 'Savings and investments',
        color: '#06b6d4',
        icon: 'piggy-bank',
        parent_id: null,
        children: [
          {
            name: 'Emergency Fund',
            description: 'Emergency savings',
            color: '#0891b2',
            icon: 'life-ring',
          },
          {
            name: 'Retirement',
            description: 'Retirement savings (401k, IRA)',
            color: '#0e7490',
            icon: 'calendar',
          },
          {
            name: 'Vacation',
            description: 'Vacation and travel savings',
            color: '#155e75',
            icon: 'plane',
          },
        ],
      },
    ];

    for (const categoryData of categories) {
      const existingCategory = await categoryRepo.findOne({
        where: { name: categoryData.name, household_id: household.id },
      });

      if (!existingCategory) {
        const category = categoryRepo.create({
          name: categoryData.name,
          description: categoryData.description,
          color: categoryData.color,
          icon: categoryData.icon,
          parent_id: undefined,
          household_id: household.id,
        });
        const savedCategory: Category = await categoryRepo.save(category);
        console.log(`Created category: ${categoryData.name}`);

        // Create subcategories
        if (categoryData.children && categoryData.children.length > 0) {
          for (const childData of categoryData.children) {
            const existingChild = await categoryRepo.findOne({
              where: { name: childData.name, household_id: household.id },
            });

            if (!existingChild) {
              const childCategory = categoryRepo.create({
                name: childData.name,
                description: childData.description,
                color: childData.color,
                icon: childData.icon,
                parent_id: savedCategory.id,
                household_id: household.id,
              });
              await categoryRepo.save(childCategory);
              console.log(`Created subcategory: ${childData.name}`);
            } else {
              console.log(`Subcategory ${childData.name} already exists`);
            }
          }
        }
      } else {
        console.log(`Category ${categoryData.name} already exists`);
      }
    }

    console.log('Initial seed completed successfully!');
  }
}
