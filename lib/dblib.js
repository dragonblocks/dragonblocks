class dblib
{
	static center(elem)
	{
		elem.style.left = elem.parentNode.clientWidth / 2 - parseInt(elem.clientWidth) / 2 + "px";
	}

	static centerVertical(elem)
	{
		let parent = elem.parentNode;
		if (parent == document.body)
			parent = document.documentElement;
		elem.style.top = parent.clientHeight / 2 - parseInt(elem.clientHeight) / 2 + "px";
	}

	static random(min, max)
	{
		return Math.floor(min + Math.random() * (max - min + 1));
	}

	static humanFormat(str)
	{
		str = str.replace("_", " ");
		str = str[0].toUpperCase() + str.slice(1, str.length);
		return str;
	}

	static copy(dst, src, condition)
	{
		for (let key in src){
			let value = src[key];

			if (condition && ! condition(key, value)) {
				console.log(key, value);
				continue;
			}

			if (value instanceof Array)
				this.copy(dst[key] = [], value, condition);
			else if (value instanceof Function)
				dst[key] = value;
			else if (value instanceof Object)
				this.copy(dst[key] = {}, value, condition);
			else
				dst[key] = value;
		}

		return dst;
	}

	static copySimple(dst, src)
	{
		for (let key in src)
			dst[key] = src[key];
	}

	static htmlEntities(str)
	{
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/\n/g, "<br>")
			.replace(/\t/g, "&emsp;&emsp;")
			.replace(/ /g, "&ensp;");
	}

	static removeTmp(src)
	{
		let dst = {};

		if (src instanceof Array)
			dst = [];

		return dblib.copy(dst, src, key => key != "tmp");;
	}

	static replaceRecursive(src, search, replace)
	{
		let dst = {};

		if (src instanceof Array)
			dst = [];

		dblib.copySimple(dst, src);

		for (let key in dst) {
			let value = dst[key];

			if (value === search)
				value = replace;
			else if (value instanceof Object)
				value = this.replaceRecursive(value, search, replace);
		}

		return dst;
	}
}
