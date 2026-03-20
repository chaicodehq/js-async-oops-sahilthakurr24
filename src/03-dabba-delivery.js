/**
 * 🍱 Mumbai ka Dabbawala Service - ES6 Classes
 *
 * Mumbai ke famous dabbawala system ko ab modern ES6 class mein likho!
 * Har din hazaaron dabbas deliver hote hain aur ek bhi galat nahi jaata.
 * Tumhe DabbaService class banana hai jo customers manage kare, delivery
 * batches banaye, aur daily reports generate kare.
 *
 * Class: DabbaService
 *
 *   constructor(serviceName, area)
 *     - this.serviceName = serviceName
 *     - this.area = area
 *     - this.customers = [] (internal array)
 *     - this._nextId = 1 (auto-increment counter)
 *
 *   addCustomer(name, address, mealPreference)
 *     - mealPreference must be one of: "veg", "nonveg", "jain"
 *     - Agar invalid preference, return null
 *     - Agar name already exists (duplicate), return null
 *     - Creates customer: { id: auto-increment, name, address, mealPreference,
 *       active: true, delivered: false }
 *     - Pushes to this.customers
 *     - Returns the customer object
 *
 *   removeCustomer(name)
 *     - Sets customer's active to false (soft delete)
 *     - Returns true if found and deactivated
 *     - Returns false if not found or already inactive
 *
 *   createDeliveryBatch()
 *     - Returns array of delivery objects for all ACTIVE customers
 *     - Each delivery: { customerId: id, name, address, mealPreference,
 *       batchTime: new Date().toISOString() }
 *     - Resets delivered to false for all active customers before creating batch
 *     - Returns empty array if no active customers
 *
 *   markDelivered(customerId)
 *     - Finds active customer by id, sets delivered to true
 *     - Returns true if found and marked
 *     - Returns false if not found or not active
 *
 *   getDailyReport()
 *     - Returns report object for ACTIVE customers only:
 *       {
 *         totalCustomers: number (active only),
 *         delivered: number (active and delivered === true),
 *         pending: number (active and delivered === false),
 *         mealBreakdown: { veg: count, nonveg: count, jain: count }
 *       }
 *     - mealBreakdown counts active customers only
 *
 *   getCustomer(name)
 *     - Returns customer object by name (including inactive)
 *     - Returns null if not found
 *
 * Rules:
 *   - Use ES6 class syntax (not constructor functions)
 *   - Customer ids auto-increment starting from 1
 *   - No duplicate customer names allowed
 *   - removeCustomer is a soft delete (active: false), not actual removal
 *   - getDailyReport only counts active customers
 *   - mealPreference must be exactly "veg", "nonveg", or "jain"
 *
 * @example
 *   const service = new DabbaService("Raju Dabba", "Dadar");
 *   service.addCustomer("Amit", "Andheri West", "veg");
 *   // => { id: 1, name: "Amit", address: "Andheri West", mealPreference: "veg", active: true, delivered: false }
 *   service.addCustomer("Priya", "Bandra East", "jain");
 *   // => { id: 2, ... }
 *   service.createDeliveryBatch();
 *   // => [{ customerId: 1, name: "Amit", ... }, { customerId: 2, name: "Priya", ... }]
 *   service.markDelivered(1);       // => true
 *   service.getDailyReport();
 *   // => { totalCustomers: 2, delivered: 1, pending: 1, mealBreakdown: { veg: 1, nonveg: 0, jain: 1 } }
 */
export class DabbaService {
  constructor(serviceName, area) {
    this.serviceName = serviceName;
    this.area = area;
    this.customers = [];
    this._nextId = 1;
  }

  addCustomer(name, address, mealPreference) {
    if (
      typeof name !== "string" ||
      name === "" ||
      typeof address !== "string" ||
      address === "" ||
      typeof mealPreference !== "string"
    )
      return null;
    const availPreferences = new Set(["veg", "nonveg", "jain"]);
    if (!availPreferences.has(mealPreference)) return null;
    if (
      this.customers.some((cust) => {
        return cust.name === name;
      })
    )
      return null;

    const customer = {
      id: this._nextId++,
      name,
      address,
      mealPreference,
      active: true,
      delivered: false,
    };
    this.customers.push(customer);
    return customer;
  }

  removeCustomer(name) {
    if (this.customers.length === 0 || typeof name !== "string" || name === "") return false;

    const isActiveCustomer = this.customers.find((cust) => {
      return cust.name === name && cust.active === true;
    });

    if (!isActiveCustomer) {
      return false;
    } else {
      isActiveCustomer.active = false;
      return true;
    }
  }

  createDeliveryBatch() {
    const activeCustomers = this.customers.filter((cust) => {
      return cust.active === true;
    });
    if (activeCustomers.length === 0) return [];

    activeCustomers.forEach((cust) => {
      cust.delivered = false;
    });

    let resultArr = [];

    activeCustomers.forEach((cust) => {
      const delivery = {
        customerId: cust.id,
        name: cust.name,
        address: cust.address,
        mealPreference: cust.mealPreference,
        batchTime: new Date().toISOString(),
      };

      resultArr.push(delivery);
    });
    return resultArr;
  }

  markDelivered(customerId) {
    const customer = this.customers.find((cust) => cust.id === customerId);
    if (!customer) return false;
    customer.delivered = true;
    return true;
  }

  getDailyReport() {
    const activeCustomers = this.customers.filter((cust) => {
      return cust.active;
    });
    if (activeCustomers.length === 0) return {};

    const totalCustomers = activeCustomers.length;
    const delivered = activeCustomers.reduce((acc, curr) => {
      return curr.delivered === true ? acc + 1 : acc;
    }, 0);
    const pending = activeCustomers.reduce((acc, curr) => {
      return curr.delivered === false ? acc + 1 : acc;
    }, 0);
    let veg = 0,
      nonveg = 0,
      jain = 0;

    for (const item of activeCustomers) {
      if (item.mealPreference === "veg") {
        veg++;
      } else if (item.mealPreference === "nonveg") {
        nonveg++;
      } else {
        jain++;
      }
    }

    return {
      totalCustomers,
      delivered,
      pending,
      mealBreakdown: { veg, nonveg, jain },
    };
  }

  getCustomer(name) {
    const customer = this.customers.find((cust) => {
      return cust.name === name;
    });
    if (!customer) return null;
    return customer;
  }
}
