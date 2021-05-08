'use strict';

/* google map
('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})

('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })

console.log(`https://www.google.com/maps/dir///@${latitude},${longitude}`);

*/

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = '' + Math.random() * 20;
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; //min
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this._description = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
  click(){
      this.clicks++
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// ////////////////////////////////////////////////////////////////////////////////////
// Application Architecture
class App {
  #map;
  #mapEvent;
  #workoutArrya = [];
  #markerArray = [];
  constructor() {
    this._getPosition();
    this._getLocalStorage()

    // Event Handler
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevation);
    containerWorkouts.addEventListener('click', this._movetoMarker.bind(this));
    containerWorkouts.addEventListener('contextmenu', this._removeMarker.bind(this));
  }

  _getPosition() {
    navigator.geolocation?.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('Failed to cath current position');
      }
    );
  }

  _loadMap(positions) {
    const {
      coords: { longitude, latitude },
    } = positions;
    const cordinates = [latitude, longitude];
    this.#map = L.map('map').setView(cordinates, 13);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
    if(JSON.parse(localStorage.getItem('workout'))){
      this.#workoutArrya.forEach(work =>{
        this._renderWorkoutMarker(work)
        this._renderWorkoutOnList(work)
    })
    }
    
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value =
      '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevation() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const isNumber = (...array) => array.every(arr => Number.isFinite(arr));
    const isPositive = (...array) => array.every(arr => arr > 0);
    let workout;
    // get data from form
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const { lat, lng } = this.#mapEvent.latlng;
    // check data if it is valid

    // if activity is running create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !isNumber(duration, distance, cadence) ||
        !isPositive(duration, distance, cadence)
      )
        return alert('Inputs have to be Positive Number');

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    // if activity is cycling create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !isNumber(duration, distance, elevation) ||
        !isPositive(duration, distance)
      )
        return alert('Inputs have to be Positive Number');
       workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // Add new object to workout
    this.#workoutArrya.push(workout);
    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    // Render workout on list as
    this._renderWorkoutOnList(workout);
    // Hide form + Clear All input Field
    this._hideForm();
    // Set workout in local storage
    this._setLocalStorage()
  }

  _renderWorkoutMarker(workout) {
    // marker = new L.Marker(e.latlng, {draggable:true});
   let marker = new L.Marker(workout.coords);
   this.#map.addLayer(marker);
      marker.bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🦶🏼' : '🚴‍♀️'}   ${workout._description}`
      )
      .openPopup();
   this.#markerArray.push(marker)  
  }
  _renderWorkoutOnList(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout._description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🦶🏼' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (workout.type === 'running') {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
        </div>
        </li>
        `;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
        `;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  _movetoMarker(e) {
    const makredEl = e.target.closest('.workout');
    if (!makredEl) return;

    const workout = this.#workoutArrya.find(
      work => work.id === makredEl.dataset.id
    );
    this.#map.setView(workout.coords, 13, {
      animation: true,
      pan: {
        duration: 1,
      },
    });
    workout.click()
  }
  _removeMarker(e){
    e.preventDefault()
    const makredEl = e.target.closest('.workout');
    if (!makredEl) return;
    const workoutIndex = this.#workoutArrya.findIndex(
      work => work.id === makredEl.dataset.id
    );
    makredEl.remove()
    this.#map.removeLayer(this.#markerArray[workoutIndex]);
    this.#markerArray.splice(workoutIndex, 1)
    this.#workoutArrya.splice(workoutIndex, 1)
    this._setLocalStorage()
  }
  _setLocalStorage(){
    localStorage.setItem('workout', JSON.stringify(this.#workoutArrya))
  }

  _getLocalStorage(){
    const data = JSON.parse(localStorage.getItem('workout'))
    if(!data) return
    data.forEach(work=>{
      let workout 
      if(work.type === 'running'){
      workout = new Running(work.coords, work.distance, work.duration, work.cadence)
      }
      if(work.type === 'cycling'){
      workout = new Cycling(work.coords, work.distance, work.duration, work.elevation)
      }
      this.#workoutArrya.push(workout)
    })
  }
}

const mapty = new App();
