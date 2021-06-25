// Library for Dragonblocks
class dblib{
	static center(elem){
		elem.style.left = elem.parentNode.clientWidth / 2 - parseInt(elem.clientWidth) / 2 + "px";
	}
	static centerVertical(elem){
		let parent = elem.parentNode;
		if (parent == document.body)
			parent = document.documentElement;
		elem.style.top = parent.clientHeight / 2 - parseInt(elem.clientHeight) / 2 + "px";
	}
	static random(min, max){
		return Math.floor(min + Math.random() * (max - min + 1));
	}
	static humanFormat(str){
		var str = str.replace("_", " ");
		str = str[0].toUpperCase() + str.slice(1, str.length);
		return str;
	}
	static copy(dest, src){
		for(let prop in src){
			if(src[prop] instanceof Array){
				dest[prop] = [];
				this.copy(dest[prop], src[prop]);
			}
			else if(src[prop] instanceof Function){
				dest[prop] = src[prop];
			}
			else if(src[prop] instanceof Object){
				dest[prop] = {};
				this.copy(dest[prop], src[prop]);
			}
			else{
				dest[prop] = src[prop];
			}
		}
	}
	static copySimple(dest, src){
		for(let prop in src){
			dest[prop] = src[prop];
		}
	}
	static htmlEntities(str){
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, "<br>").replace(/\t/g, "&emsp;&emsp;").replace(/ /g, "&ensp;");
	}
	static removeTmp(src){
		let obj = {};
		if(src instanceof Array)
			obj = [];
		dblib.copy(obj, src);
		for(let prop in obj){
			if(obj[prop].tmp)
				delete obj[prop].tmp
		}
		return obj;
	}
	static replaceRecursive(src, search, replace){
		let obj = {};
		if(src instanceof Array)
			obj = [];
		dblib.copySimple(obj, src);
		for(let prop in obj){
			if(obj[prop] === search)
				obj[prop] = replace;
			else if(obj[prop] instanceof Object)
				obj[prop] = this.replaceRecursive(obj[prop], search, replace);
		}
		return obj;
	}
}
