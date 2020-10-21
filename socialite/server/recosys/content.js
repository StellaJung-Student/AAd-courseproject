const data = require("../util/userdata");

const ex = require("express");

function check (a,b)
{
	if(a == b)
		return 1;
	else 
		return 0;
}

function checkhos (a,b)
{
	if(a < 100) //for obh 
	{
		if(b < 100)
			return 1;
		else 
			return 0;
	}
	else // for non obh
	{
		x = (a/100)%100| 0 ; // for hundred's place 
		y = (b/100)%100| 0 ; // for hundred's place 
		z = check(x,y);
		return z;
	}
}

async function host_hous(id)
{
	cur = await data.getProfileById(id);
	var hosnum = cur.hosnum;
	var hosname = cur.hosname;
	var house = cur.house;
	var count_hostel = 0;
	var count_hosname = 0;
	var count_house = 0;
	const total = cur.friends.length;
	for(i = 0; i < cur.friends.length; ++i)
	{
		var fren = await data.getProfileById(cur.friends[i]);
		count_hostel = count_hostel+checkhos(hosnum,fren.hosnum);
		count_hosname = count_hosname+check(hosname,fren.hosname);
		count_house = count_house+check(house,fren.house);
	}
	count_hostel = count_hostel/total;
	count_hosname = count_hosname/total;
	count_house = count_house/total;
	return [count_hostel, count_hosname, count_house];
}

async function sporty(id)
{
	cur = await data.getProfileById(id);
	var sports = cur.sports;
	const sporlen = cur.sports.length;
	const total = cur.friends.length;
	var sporarr = Array(sporlen).fill(0);
	for(i = 0; i < cur.friends.length; ++i)
	{
		var fren = await data.getProfileById(cur.friends[i]);
		var spofre = fren.sports;
		var spofrelen = fren.length;
		for(j = 0; j < sporlen; ++j)
		{
			for(k = 0; k < spofrelen; ++k)
			{
				sporarr[j]=sporarr[j]+check(sports[j],spofre[k]);	
			}
			sporarr[j]=sporarr[j]/total;
		}
	}
	return sporarr;
}

async function club(id)
{
	cur = await data.getProfileById(id);
	var clubs = cur.clubs;
	const clulen = cur.clubs.length;
	const total = cur.friends.length;
	var cluarr = Array(clulen).fill(0);
	for(i = 0; i < cur.friends.length; ++i)
	{
		var fren = await data.getProfileById(cur.friends[i]);
		var clufre = fren.clubs;
		var clufrelen = fren.length;
		for(j = 0; j < clulen; ++j)
		{
			for(k = 0; k < clufrelen; ++k)
			{
				cluarr[j]=cluarr[j]+check(clubs[j],clufre[k]);	
			}
			cluarr[j]=cluarr[j]/total;
		}
	}
	return cluarr;
}

async function percen(id)
{
	cur = await data.getProfileById(id);
	var perhos = await host_hous(id);
	var persport = await sporty(id);
	var perclub = await club(id);
	const sporlen = cur.sports.length;
	var totsport;
	var totclub;
	for(j = 0; j < sporlen; ++j)
	{
		totsport = totsport + persport[j];
	}
	const clulen = cur.clubs.length;
	for(j = 0; j < clulen; ++j)
	{
		totclub = totclub + perclub[j];
	}
	total = perhos[0] + perhos[1] + perhos[2] + totclub + totsport;
	return total; 
}

async function scoring(a,b)
{
	cur = await data.getProfileById(a);
	const nonfren = await data.getProfileById(b);
	var total = await percen(a);
	var perhos = await host_hous(a);
	var persport = await sporty(a);
	var perclub = await club(a);
	var score = 0;
	score = score + perhos[0]*checkhos(cur.hosnum,nonfren.hosnum);
	score = score + perhos[1]*check(cur.hosname,nonfren.hosname);
	score = score + perhos[2]*check(cur.house,nonfren.house);

	const sporlenuser = cur.sports.length;
	const sporlennon = nonfren.sports.length;
	for(j = 0; j < sporlenuser; ++j)
	{
		for(k = 0; k < sporlennon; ++k)
		{
			score = score + persport[j]*check(cur.sports[j],nonfren.sports[k]);	
		}
	}
	const clulenuser = cur.clubs.length;
	const clulennon = nonfren.clubs.length;
	for(j = 0; j < clulenuser; ++j)
	{
		for(k = 0; k < clulennon; ++k)
		{
			score = score + perclub[j]*check(cur.clubs[j],nonfren.clubs[k]);		
		}
	}
	return score;
}

module.exports = { "scoring": scoring };
