$(document).ready(init)

$('#localhost_btn').click(function () {
  localport = sense.utils.localhostport()
  $('#es_server').val('http://localhost:' + localport)
})

$('#bookmark_btn').click(function () {
  var tlocation = window.location
  var es_server_val = $('#es_server').val()
  var es_server_index_val = $('#es_server_index').val()
  var desturl = tlocation.origin + tlocation.pathname + '?server=' + es_server_val
  if (es_server_index_val !== '') {
    desturl += '&index=' + es_server_index_val
  }
  window.location = desturl
})

// Query Builder
var assignQueryInline = function (url, body) {
  body = body || ''
  var query = url + body + '\n\n'
  sense.utils.setQueryInNewLine(query)
}

$('#matchall_btn').click(function () {
  var url = 'GET _search\n'
  var body = sense.utils.formatJson('{"query":{"match_all":{}}}')
  assignQueryInline(url, body)
})

$('#filter_btn').click(function () {
  var f = prompt('Name of the field?')
  var v = prompt('Value?')
  var url = 'GET _search\n'
  var body = sense.utils.formatJson(
    '{"query":{"bool":{"filter":[{"terms":{"' + f + '":["' + v + '"]}}]}},"_source":["*"]}')
  assignQueryInline(url, body)
})

$('#exists_btn').click(function () {
  var f = prompt('Name of the field?')
  var url = 'GET _search\n'
  var body = sense.utils.formatJson('{"query":{"exists":{"field":"' + f + '"}}}')
  assignQueryInline(url, body)
})

$('#matchids_btn').click(function () {
  var ids = prompt('Enter the id(s) to search')
  var url = 'GET _search\n'
  var body = sense.utils.formatJson(
    '{"query" : {"ids": {"values":["' + ids + '"]}}}')
  assignQueryInline(url, body)
})

$('#reindex_btn').click(function () {
  var params = prompt('Enter comma separated: source, destination, optionsflag (optional parameter)')
  params = params.split(',')
  var source = params[0]
  var destination = params[1]
  if (params[2] !== undefined) {
    var size = prompt('Enter the size of the reindex:')
    var lsource = prompt('Enter the filtered source comma separated:')
  }
  var baseReindexQuery = {
    source: {
      index: source
    },
    dest: {
      index: destination
    }
  }
  if (size !== undefined) {
    baseReindexQuery.source.size = size
  }
  if (lsource !== undefined) {
    baseReindexQuery.source._source = lsource.split(',')
  }
  var url = 'POST _reindex\n'
  var body = sense.utils.formatJson(JSON.stringify(baseReindexQuery))
  assignQueryInline(url, body)
})


// Metadata

$('#indices_btn').click(function () {
  assignQueryInline('GET /_cat/indices?v')
})

$('#aliases_btn').click(function () {
  assignQueryInline('GET /_aliases')
})

$('#aliasescreate_btn').click(function () {
  var index = prompt('Name of the index?')
  var alias = prompt('Name of the alias?')
  var url = 'POST /_aliases\n'
  var body = sense.utils.formatJson(
    '{"actions":[{"add":{"index":"' + index + '","alias":"' + alias + '"}}]}')
  assignQueryInline(url, body)
})

$('#mapping_btn').click(function () {
  assignQueryInline('GET _mapping')
})

$('#health_btn').click(function () {
  assignQueryInline('GET /_cat/health?v')
})

// Aggregations

$('#simpleagg_btn').click(function () {
  var f = prompt('Name of the field?')
  var a = f + '_agg'
  var url = 'GET _search\n'
  var body = sense.utils.formatJson(
    '{"size":0,"aggs":{"' + a + '":{"terms":{"field":"' + f + '"}}}}')
  assignQueryInline(url, body)
})


$('#statsagg_btn').click(function () {
  var f = prompt('Name of the field?')
  var a = f + '_agg'
  var baseStatsaggQuery = {
    size: 0,
    aggs: {
      [a]: {
        stats: {
          field: f,
          missing: 0
        }
      }
    }
  }
  var url = 'GET _search\n'
  var body = sense.utils.formatJson(JSON.stringify(baseStatsaggQuery))
  assignQueryInline(url, body)
})

$('#significantterms_btn').click(function () {
  var ans = prompt('Enter comma separated: queryfield, queryvalue, aggregationvalue')
  var params = ans.split(',')
  var f = params[2] || ''
  var a = f + '_agg'
  var baseStAgg = {
    size: 0,
    query: {
      match: {
        [params[0]]: params[1]
      }
    },
    aggs: {
      [a]: {
        significant_terms: {
          field: f
        }
      }
    }
  }
  var url = 'GET _search\n'
  var body = sense.utils.formatJson(JSON.stringify(baseStAgg))
  assignQueryInline(url, body)
})
