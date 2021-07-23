let TimerLocation = null;
const Location = {
    locationRegion: $('.JS-location-region'),
    district: $('.JS-district'),
    locality: $('.JS-locality'),
    county: $('.JS-county'),
    street: $('.JS-street'),
    subLocality: $('.JS-sub-locality'),
    microDistrict: $('.JS-micro-district'),
    direction: $('.JS-direction'),
    metro: $('.JS-metro'),
    init: function (selector) {
      $(selector).each((i, el) => {
          let $selectEl = $(el), _theme = $selectEl.data('theme-select2') || 'default';
          $selectEl.select2({
              language: 'ru',
              width: '100%',
              theme: _theme,
              escapeMarkup: markup => markup,
              tags: true,
              insertTag: function (data, tag) {
                  if(data.length === 0){
                      clearTimeout(TimerLocation);
                      TimerLocation = setTimeout(() => Location.ajaxLocation($($(this)[0].$element[0]), tag.text, data), 1000);
                  }
              }
          });
      });
        $(selector).on('change', (e) => Location.getData($(e.target)))
    },
    ajaxLocation: function (input, search, _data) {
        let source = input.data('source'),
            dependOn = input.data('depends'),
            onlyActiveValue = input.data('only-active'),
            url = source,
            minLength = 2,
            maxItems = 50,
            _options = $('option', input),
            count = _options.length;
        if (!source){
            console.log('Error. Source field does not set');
            return '';
        }
        if (dependOn) {
            if ($(dependOn).length > 0) {
                url += $(dependOn).val();
            }
        }
        if (search.length > minLength) {
            var data = {
                query: search,
                onlyActive: onlyActiveValue
            };
            $.ajax({
                url: url,
                type: 'get',
                data: data,
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (result.errors) {
                        console.log(result.errors);
                    } else {
                        if (result.length > 0) {
                            let total = count + result.length;
                            if (total > maxItems) {
                                let diff = total - maxItems;
                                _options.each(function (i, item) {
                                    let _o = $(item);
                                    if (_o.data('ajax') === 1) {
                                        if (diff > 0) {
                                            _o.remove();
                                            diff--;
                                        }
                                    }
                                });
                            }
                            $.each(result, function (i, val) {
                                let _option = null, defaultOptions = [];

                                input.find('option').each(function (index, option) {
                                    defaultOptions[option.value] = option.value;
                                });

                                if (!!val.id) {
                                    if (!defaultOptions[val.id]) {
                                        _option = '<option data-ajax="1"  value="' + val.id + '">' + val.title + '</option>';
                                        input.prepend(_option);
                                        _data.push({id: val.id, text: val.title});
                                    }
                                } else {
                                    if (!defaultOptions[i]) {
                                        _option = '<option data-ajax="1" value="' + i + '">' + val + '</option>';
                                        input.prepend(_option);
                                        _data.push({id: i, text: val});
                                    }
                                }
                            });
                            let _optionsSelect = $('option', input);
                            _optionsSelect.removeData();
                            input.select2("close");
                            input.select2("open");
                        }
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    },
    getData: function ($addressElem) {
        let _values  =  $addressElem.val(),
            onlyActiveValue = $addressElem.data('only-active'),
            data = {
                onlyActive: onlyActiveValue,
                selectedField: $addressElem.attr('data-field'),
                value: _values
            },
            clearSelect = true;
        $.ajax({
            url: '/admin/locations/locations/find_info',
            type: 'post',
            data: JSON.stringify(data),
            dataType: 'json',
            cache: false,
            contentType: "application/json",
            success: function (result) {
                if(result){
                    Location.setData(result, clearSelect);
                }
            }
        }).fail(function(xhr){
            if(xhr.status === 403){
                alert('Закрыт доступ к URL admin/locations/locations/find_info');
            }else{
                alert(xhr.statusText);
            }
        });
    },
    setData: function (data, clearSelect) {
        let _fields_map = {
            'location_regions': Location.locationRegion,
            'districts': Location.district,
            'localities': Location.locality,
            'counties': Location.county,
            'streets': Location.street,
            'sub_localities': Location.subLocality,
            'micro_districts': Location.microDistrict,
            'directions': Location.direction,
            'metros': Location.metro
        };
        for(let _index in _fields_map){
            if (data[_index] !== undefined) {
                let _field = _fields_map[_index];
                Location.clearLocationField(_field, clearSelect);
                Location.appendOptions(data[_index], _field);
                Location.triggerLocationField(_field);
            }else{
                if (data[_index] === false) {
                    let _field = _fields_map[_index];
                    Location.clearSelectedLocationField(_field);
                }
            }
        }
    },
    clearLocationField: function (field, clearSelect) {
        let _options = $('option', field);
        _options.each(function(i, item){
            if(! clearSelect){
                if(! item.selected){
                    $(item).remove();
                }
            }else{
                $(item).remove();
            }
        });
    },
    appendOptions: function (data, to) {
        if(to.attr('type') === 'hidden'){
            return;
        }
        to.append($("<option></option>").attr("value", '').css('color', 'gray').text(''));
        let _values = to.val(), values = [];
        if(!!_values && _values.length > 0){
            $.each(_values, function(_i, _val){
                if(_val){
                    values[_val] = _val;
                }
            });
        }
        $.each(data, function (index, _data) {
            if(! values[_data.id]){
                to.append($("<option></option>").attr("value", _data.id).text(_data.title));
            }
        });
    },
    triggerLocationField: function (field) {
        field.trigger('chosen:updated');
        field.trigger('liszt:updated');
        field.trigger('updateLocationField');
    },
    clearSelectedLocationField: function (field) {
        let _options = $('option', field);
        _options.each(function(i, item){
            if(item.selected){
                item.selected = false;
            }
        });
        Location.triggerLocationField(field);
    }
}
