/** SmsBundle **/
Mautic.smsOnLoad = function (container, response) {
    if (response && response.updateSelect) {
        //added sms through a popup
        var newOption = mQuery('<option />').val(response.smsId);
        newOption.html(response.smsName);

        var opener = window.opener;
        if(opener) {
            var el = '#' + response.updateSelect;
            var optgroup = el + " optgroup[label=" + response.smsLang + "]";
            if (opener.mQuery(optgroup).length) {
                // update option when new option equal with option item in group.
                var firstOptionGroups = opener.mQuery(el + ' optgroup');
                var isUpdateOption = false;
                firstOptionGroups.each(function() {
                    var firstOptions = mQuery(this).children();
                    for (var i = 0; i < firstOptions.length; i++) {
                        if (firstOptions[i].value === response.smsId.toString()) {
                            firstOptions[i].text = response.smsName;
                            isUpdateOption = true;
                            break;
                        }
                    }
                });

                if (!isUpdateOption) {
                    //the optgroup exist so append to it
                    opener.mQuery(optgroup + " option:last").prev().before(newOption);
                }
            } else {
                //create the optgroup
                var newOptgroup = mQuery('<optgroup label="' + response.smsLang + '" />');
                newOption.appendTo(newOptgroup);
                opener.mQuery(newOptgroup).appendTo(opener.mQuery(el));
            }

            var chooseOneOption = opener.mQuery(el + ' option:first');

            var optionGroups = opener.mQuery(el + ' optgroup');
            optionGroups.sort(function(a, b) {
                var aLabel = mQuery(a).attr('label');
                var bLabel = mQuery(b).attr('label');

                if (aLabel > bLabel) {
                    return 1;
                } else if (aLabel < bLabel) {
                    return -1;
                } else {
                    return 0;
                }
            });

            optionGroups.each(function() {
                var options = mQuery(this).children();
                options.sort(function(a, b) {
                    if (a.text > b.text) {
                        return 1;
                    } else if (a.text < b.text) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                mQuery(this).html(options);
            });

            if (opener.mQuery(el).prop('disabled')) {
                opener.mQuery(el).prop('disabled', false);
                chooseOneOption = mQuery('<option value="">' + mauticLang.chosenChooseOne + '</option>');
            }

            opener.mQuery(el).html(chooseOneOption);
            optionGroups.appendTo(opener.mQuery(el));

            newOption.prop('selected', true);

            opener.mQuery(el).trigger("chosen:updated");
        }

        window.close();
    } else if (mQuery(container + ' #list-search').length) {
        Mautic.activateSearchAutocomplete('list-search', 'sms');
    }
};

Mautic.selectSmsType = function(smsType) {
    if (smsType == 'list') {
        mQuery('#leadList').removeClass('hide');
        mQuery('#publishStatus').addClass('hide');
        mQuery('.page-header h3').text(mauticLang.newListSms);
    } else {
        mQuery('#publishStatus').removeClass('hide');
        mQuery('#leadList').addClass('hide');
        mQuery('.page-header h3').text(mauticLang.newTemplateSms);
    }

    mQuery('#sms_smsType').val(smsType);

    mQuery('body').removeClass('noscroll');

    mQuery('.sms-type-modal').remove();
    mQuery('.sms-type-modal-backdrop').remove();
};

Mautic.loadNewSmsWindow = function(options) {
    if (options.windowUrl) {
        Mautic.startModalLoadingBar();

        setTimeout(function() {
            var generator = window.open(options.windowUrl, 'newsmswindow', 'height=600,width=340');

            if (!generator || generator.closed || typeof generator.closed == 'undefined') {
                alert(response.popupBlockerMessage);
            } else {
                generator.onload = function () {
                    Mautic.stopModalLoadingBar();
                    Mautic.stopIconSpinPostEvent();
                };
            }
        }, 100);
    }
};