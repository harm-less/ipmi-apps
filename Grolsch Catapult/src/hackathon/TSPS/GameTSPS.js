var GameTSPS = function(local){
  this.is_local = (typeof $$gamesetup.is_local != 'undefined') ? $$gamesetup.is_local : true;
  this.onUpdateList = [];
  this.onEnterList = [];
  this.onLeaveList = [];
  this.persons = [];

  this.connection = this.is_local ? new TSPS.Connection() : new TSPS.Connection( $$gamesetup.tsps_ip, $$gamesetup.tsps_port );

  this.onUpdate = function(onUpdateFunc){
    this.onUpdateList.push(onUpdateFunc);
  }
  this.onEnter = function(onEnterFunc){
    this.onEnterList.push(onEnterFunc);
  }
  this.onLeave = function(onLeaveFunc){
    this.onLeaveList.push(onLeaveFunc);
  }

  this.callFunctions = function(data){
    for (i in this) {
      if(typeof this[i] == "function")
        this[i](data);
    }
  }

  this.connection.onPersonEntered = this.callFunctions.bind(this.onEnterList)
  this.connection.onPersonMoved = this.callFunctions.bind(this.onUpdateList)
  this.connection.onPersonUpdated = this.callFunctions.bind(this.onUpdateList)
  this.connection.onPersonLeft = this.callFunctions.bind(this.onLeaveList)
}


