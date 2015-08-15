 Cobalt.datePicker.protoype = function() {
   var self = this;

   var datePicker = {
     enabled: true,
     texts: {
       validate: "Ok",
       cancel: "Cancel",
       clear: "Clear"
     },
     //default format is "yyyy-mm-dd".
     format: function(value) {
       return value;
     },
     placeholderStyles: "width:100%; color:#AAA;",
     //internal
     init: function() {
       var inputs = self.utils.$('input[type=date]');

       self.utils.each(inputs, function() {
         var input = this;
         var id = self.utils.attr(input, 'id');
         if (!id) {
           id = 'CobaltGeneratedId_' + Math.random().toString(36).substring(7);
           self.utils.attr(input, 'id', id);
         }
         datePicker.updateFromValue.apply(input);
       });

       if (self.adapter && self.adapter.datePicker && self.adapter.datePicker.init) {
         self.adapter.datePicker.init(inputs);
       }
     },
     updateFromValue: function() {
       var id = self.utils.attr(this, 'id');
       self.log("updating storage value of date #", id);
       if (this.value) {
         self.utils.addClass(this, 'not_empty');
       } else {
         self.utils.removeClass(this, 'not_empty');
       }
       self.log('current value is', this.value);
       var values = this.value.split('-');
       if (values.length == 3) {
         var d = {
           year: parseInt(values[0], 10),
           month: parseInt(values[1], 10),
           day: parseInt(values[2], 10)
         };
         self.log('setting storage date ', 'CobaltDatePickerValue_' + id, d);
         self.storage.set('CobaltDatePickerValue_' + id, d);

       } else {
         self.log('removing date');
         self.storage.remove('CobaltDatePickerValue_' + id);
       }
       return false;
     },
     enhanceFieldValue: function() {
       var date = self.storage.get('CobaltDatePickerValue_' + self.utils.attr(this, 'id'));
       if (date) {
         self.log('format date=', date);
         this.value = datePicker.format(datePicker.stringifyDate(date));
       }
     },
     stringifyDate: function(date) {
       if (date && date.year !== undefined) {
         return date.year + '-' + datePicker.zerofill(date.month, 2) + '-' + datePicker.zerofill(date.day, 2);
       }
       return "";
     },
     zerofill: function(number, padding) {
       var _zerofill = (new Array(padding + 1).join("0") + number)
         .slice(-padding).toString();
       return _zerofill;
     },
     val: function(input) {
       if (input[0] && input[0].value !== undefined) {
         input = input[0];
       }
       if (self.adapter && self.adapter.datePicker && self.adapter.datePicker.val) {
         selfc.log('returning cobalt adapter datePicker value');
         return self.adapter.datePicker.val(input);
       } else {
         self.log('returning cobalt default datePicker value');
         return input.value || undefined;
       }
     }
   };

   datePicker.init();

   return datePicker;
 };
