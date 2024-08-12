input_upd = false;
on_delay = false;
blocks = {}

g_width = 0;
g_height = 0;
g_data = nil;
g_def = {
	'setColor',
	'drawClear',
	'drawLine',
	'drawCircle',
	'drawCircleF',
	'drawRect',
	'drawRectF',
	'drawTriangle',
	'drawTriangleF',
	'drawText',
	'drawTextBox',
	'drawMap',
	'setMapColorOcean',
	'setMapColorShallows',
	'setMapColorLand',
	'setMapColorGrass',
	'setMapColorSand',
	'setMapColorSnow',
	'setMapColorRock',
	'setMapColorGravel'
}

function dec(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    data = string.gsub(data, '[^'..b..'=]', '')
    return (data:gsub('.', function(x)
        if (x == '=') then return '' end
        local r,f='',(b:find(x)-1)
        for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end
        return r;
    end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x)
        if (#x ~= 8) then return '' end
        local c=0
        for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end
        return string.char(c)
    end))
end

local function clone(t)
  local new_t = {}
  for k, v in pairs(t) do
    new_t[k] = v
  end
  return new_t
end

function geninput() 
	local str = '';
	
	for i = 1, 32 do
		str = str .. tostring(input.getNumber(i)) .. ';';
	end
	
	for i = 1, 32 do
		str = str .. tostring(input.getBool(i) and 1 or 0) .. ';';
	end
	
	str = str .. g_height .. ':' .. g_width;

	return str;
end

function split(str, delimiter)
    local result = {}
    for match in (str .. delimiter):gmatch("(.-)" .. delimiter) do
        table.insert(result, match)
    end
    return result
end

function onTick()
	if (not on_delay) then
		on_delay = true;
		inp = geninput();
    	async.httpGet(8080, '/'.. property.getText('ChipID') ..'?data=' .. inp)
	end

	if (input_upd) then
		if (not (#blocks < 64)) then
			for i = 1, 32 do
				output.setNumber(i, tonumber(blocks[i]));
			end
			
			for i = 33, 64 do
				output.setBool(i - 32, blocks[i] == '1');
			end
		end
		input_upd = false;
	end
end

function onDraw()
    g_width = screen.getWidth();
    g_height = screen.getHeight();
    if (g_data == nil) then return end

    for i = 1, #g_data do
    	if (g_data[i] == {}) then goto continue end

		g_dataloc = {};
		for x = 1, #g_data[i] do
			if (g_data[i][1] == '10' and x == 4) then
				g_dataloc[x] = dec(g_data[i][x]);
			elseif (g_data[i][1] == '11' and x == 6) then
				g_dataloc[x] = dec(g_data[i][x]);
			else
				g_dataloc[x] = tonumber(g_data[i][x]);
			end
		end
		
    	screen[g_def[g_dataloc[1]]](table.unpack(g_dataloc, 2));
    	
    	::continue::
    end
end

function httpReply(port, request_body, response_body)
	on_delay = false;
	blocks = split(response_body, ';');
	
	if (#blocks >= 64) then input_upd = true; end
	if (#blocks >= 65 and (not (blocks[65] == ''))) then
		gblock = split(blocks[65], ':')
		g_data = {}
		for i = 1, #gblock do
			g_data[i] = split(gblock[i], '#')
		end
	end
end