
$.fn.eventlist = function(opts, _arg) {
  var change_status, dataurl, init, update_event;
  _arg;
  dataurl = null;
  update_event = function(d) {
    var elem;
    elem = $("#e-" + d.eid);
    elem.find(".plabel").hide();
    elem.find(".dlabel").hide();
    elem.find("button").hide();
    if (!d.participant && !d.waitinglist && !d.maybe) {
      if (d.full) {
        elem.find(".btn-joinwl").show();
      } else {
        elem.find(".btn-join").show();
      }
      elem.find(".btn-maybe").show();
    } else {
      elem.find(".dropdown-toggle").removeClass("btn-info").removeClass("btn-success").removeClass("btn-warning");
      if (d.participant) {
        elem.find(".label-going").show();
        elem.find(".dlabel.maybe").show();
        elem.find(".dropdown-toggle").addClass("btn-success");
      } else if (d.waitinglist) {
        elem.find(".label-waitinglist").show();
        elem.find(".dlabel.maybe").show();
        elem.find(".dropdown-toggle").addClass("btn-warning");
      } else if (d.maybe) {
        elem.find(".label-maybe").show();
        elem.find(".dlabel.going").show();
        elem.find(".dropdown-toggle").addClass("btn-info");
      }
      elem.find(".pselect").show();
      elem.find(".dropdown-toggle").show();
    }
    elem.find(".filled").text(d.filled);
    return elem.find(".size").text(d.size);
  };
  init = function() {
    dataurl = $(this).data("url");
    $.ajax({
      url: dataurl,
      type: "GET",
      success: function(data) {
        var d, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          _results.push(update_event(d));
        }
        return _results;
      }
    });
    $(this).find(".actions > button").click(function() {
      return change_status(this);
    });
    return $(this).find(".dropdown-menu a").click(function() {
      return change_status(this);
    });
  };
  change_status = function(elem) {
    var eid, status;
    eid = $(elem).closest(".event").data("id");
    status = $(elem).data("status");
    return $.ajax({
      url: dataurl,
      method: "POST",
      data: {
        eid: eid,
        status: status
      },
      success: function(data) {
        return update_event(data);
      },
      error: function() {
        return alert("An unknown error occurred, please try again");
      }
    });
  };
  $(this).each(init);
  return this;
};

$.fn.datelist = function(opts, _arg) {
  var dataurl, init, update_date;
  _arg;
  dataurl = null;
  update_date = function(d) {
    var elem;
    elem = $("#e-" + d.eid);
    if (d.participant) {
      return elem.find(".plabel-going").show();
    } else if (d.maybe) {
      return elem.find(".plabel-maybe").show();
    } else if (d.waitinglist) {
      return elem.find(".plabel-waiting").show();
    } else {
      return elem.find(".plabel-not").show();
    }
  };
  init = function() {
    dataurl = $(this).data("url");
    return $.ajax({
      url: dataurl,
      type: "GET",
      success: function(data) {
        var d, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          _results.push(update_date(d));
        }
        return _results;
      }
    });
  };
  $(this).each(init);
  return this;
};

$(document).ready(function() {
  var hash, prefix;
  $("#eventlist").eventlist();
  $("#datelist").datelist();
  $('.participant-avatar').tooltip({
    container: 'body'
  });
  hash = document.location.hash;
  prefix = "tab_";
  if (hash) $('.nav-tabs a[href=' + hash.replace(prefix, "") + ']').tab('show');
  return $('.nav-tabs a').on('shown', function(e) {
    return window.location.hash = e.target.hash.replace("#", "#" + prefix);
  });
});
