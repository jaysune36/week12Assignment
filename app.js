
const submitBtn = $('#submitBtn');
const carMake = $('#carMake');
const carModel = $('#carModel');
const carYear = $('#carYear');

// Car Class accepts 3 arguments. Make and Model arguments are a string and Year is a number
class Cars {
  constructor(make, model, year){
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

class CarsListAPI {
  static url = 'https://64e526dfc555638029142f27.mockapi.io/PromineoTechAPI/CarsList';

  static getCarsList() {
    return $.get(this.url)
  }

  static getCar(id) {
    return $.get(this.url + `/${id}`)
  }

  static deleteCarsList(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    })
  }

  static updateCarsList(car) {
    return $.ajax({
      url: this.url + `/${car._id}`,
      dataType: 'json',
      data: JSON.stringify(car),
      contentType: 'application/json',
      type: 'PUT'
    });
  }

  static createCar(car) {
    return $.post(this.url, car)
  }
}

class DOMManager {
  static cars;

  static createCarsTable() {
    CarsListAPI.getCarsList()
                .then(cars => this.render(cars))
  }

  static render(cars) {
    this.cars = cars;
    for(let car of cars ) {
      $('tbody').prepend(`
      <tr class="${car.id}">
        <td>${car.carMake}</td>
        <td>${car.carModel}</td>
        <td>${car.year}</td>
        <td>
        <button class="btn btn-danger" onclick="deleteCar(${car.id}-id)">Delete</button>
        <button class="btn btn-success" onclick="editCar(${car.id}-id)">Edit</button>
        </td>
      </tr>
    `)
    }
  }

}

DOMManager.createCarsTable();


