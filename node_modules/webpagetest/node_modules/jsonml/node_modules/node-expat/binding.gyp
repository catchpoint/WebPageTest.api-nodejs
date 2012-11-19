{
  'targets': [
    {
      'target_name': 'node_expat',
      'sources': [ 'node-expat.cc' ],
      'dependencies': [
        'deps/libexpat/libexpat.gyp:expat'
      ]
    }
  ]
}
