/* globals AFRAME, Event, THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Selected component for A-Frame.
 */
AFRAME.registerComponent('selectable', {
  schema: { },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    this.selected = null;
  },

  getScene: function () {
    var result = this.el;

    while (result.parentNode && result.nodeName !== 'a-scene') {
      result = result.parentNode;
    }

    return result;
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    var self = this;

    var preventDefault = false;

    this.getScene().addEventListener('click', function (e) {
      if (preventDefault) {
        return;
      }

      self.select(null);
    });

    this.el.addEventListener('click', function (e) {
      if (e.target === self.el) {
        return;
      }

      self.select(e.target);

      var event = new Event('selected');
      event.selected = e.target;
      self.el.dispatchEvent(event);

      preventDefault = true;

      // fixme: gross
      setTimeout(() => {
        preventDefault = false;
      }, 5);
    });
  },

  select: function (entity) {
    var obj = this.el.object3D;

    this.selected = entity;

    if (this.bbox) {
      obj.remove(this.bbox);
      delete this.bbox;
    }

    if (this.selected) {
      this.bbox = new THREE.BoundingBoxHelper(this.selected.object3D, '#ff7700');
      this.bbox.update();
      obj.add(this.bbox);
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    if (this.bbox) {
      this.el.object3D.remove(this.bbox);
    }

    // Unassign
    this.selected = null;
    this.bbox = null;
  },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
    if (this.bbox) {
      this.bbox.update();
    }
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
