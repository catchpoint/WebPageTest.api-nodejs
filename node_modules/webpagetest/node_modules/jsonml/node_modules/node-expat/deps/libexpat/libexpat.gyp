# This file is used with the GYP meta build system.
# http://code.google.com/p/gyp
# To build try this:
#   svn co http://gyp.googlecode.com/svn/trunk gyp
#   ./gyp/gyp -f make --depth=`pwd` libexpat.gyp
#   make
#   ./out/Debug/test

{
  'target_defaults': {
    'default_configuration': 'Debug',
    'configurations': {
      # TODO: hoist these out and put them somewhere common, because
      #       RuntimeLibrary MUST MATCH across the entire project
      'Debug': {
        'defines': [ 'DEBUG', '_DEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 1, # static debug
          },
        },
      },
      'Release': {
        'defines': [ 'NDEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 0, # static release
          },
        },
      }
    },
    'msvs_settings': {
      'VCCLCompilerTool': {
      },
      'VCLibrarianTool': {
      },
      'VCLinkerTool': {
        'GenerateDebugInformation': 'true',
      },
    },
  },

  'targets': [
    {
      'variables': { 'target_arch%': 'ia32' }, # default for node v0.6.x
      'target_name': 'expat',
      'product_prefix': 'lib',
      'type': 'static_library',
      'sources': [
        'lib/xmlparse.c',
        'lib/xmltok.c',
        'lib/xmlrole.c',
      ],
      'defines': [
        'PIC',
        'HAVE_EXPAT_CONFIG_H'
      ],
      'include_dirs': [
        '.',
        'lib',
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          '.',
          'lib',
        ],
        'conditions': [
          ['OS=="win"', {
            'defines': [
              'XML_STATIC'
            ]
          }]
        ],
      },
    },

    {
      'target_name': 'version',
      'type': 'executable',
      'dependencies': [ 'expat' ],
      'sources': [ 'version.c' ]
    },
  ]
}
