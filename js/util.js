


function UTIL(){
}

UTIL.prototype.getDom= function(id) {
    return document.getElementById(id);
};
UTIL.prototype.hideDom= function(dom) {
    if (dom && typeof dom === 'string') {
        dom = this.getDom(dom);
    }
    dom.classList.add('flex-hide');
};

UTIL.prototype.showDom= function(dom) {
    if (dom && typeof dom === 'string') {
        dom = this.getDom(dom);
    }
    dom.classList.remove('flex-hide');
};

UTIL.prototype.json2obj= function(txt) {
    try {
        var obj = JSON.parse(txt);
        return obj;
    } catch (e) {
        return null;
    }
};

UTIL.prototype.getSessionStorage= function(key) {
  try {
      var data = sessionStorage.getItem("mzLottery418"+key);
      data = this.json2obj(data);
      return data || {};
     
  } catch (ex) {
    return {};
  }
};

UTIL.prototype.setSessionStorage= function(key, data) {
	try {
	      if( data === null ) {
	          sessionStorage.removeItem("mzLottery418"+key);
	          return;
	      }
	      if (typeof data === 'object') {
	          data = this.obj2json(data);
	      }
	      sessionStorage.setItem("mzLottery418"+key, data);
	  } catch (ex) {alert(ex.message);}
};



UTIL.prototype.setLocalStorage= function(key, data) {
	try {
	      if( data === null ) {
	          localStorage.removeItem("mzLottery418"+key);
	          return;
	      }
	      if (typeof data === 'object') {
	          data = this.obj2json(data);
	      }
	      localStorage.setItem("mzLottery418"+key, data);
	  } catch (ex) {alert(ex.message);}
};

UTIL.prototype.getLocalStorage= function(key) {
  try {
      var data = localStorage.getItem("mzLottery418"+key);
      data = this.json2obj(data);
      return data || {};
     
  } catch (ex) {
    return {};
  }
};


UTIL.prototype.obj2json= function(obj) {
    try {
        var txt = JSON.stringify(obj);
        return txt;
    } catch (e) {
        return null;
    }
};

UTIL.prototype.CRand=function(min,max,seed)
{
	if( !seed  )
	{
		seed = Math.random();
	}
	var ret = Math.ceil( seed*((max+1) - min ) - 1 ) + min;
	return ret;
};


UTIL.prototype.productPhone=function(phone)
{

  var ret = "";
  var temp = 6;
  for( var i = 0 ,iLen = phone.length; i < iLen ; i++ )
  {
    if( i >= 3 && i <= temp)
    {
      ret += '*';
    }
    else
    {
      ret += phone[i];
    }
  }
  return ret;
};
