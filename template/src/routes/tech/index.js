import React from 'react'
import * as Navi from 'navi'

export default Navi.route({
  title: "About",
  getView: () => {
    return (
      <div>
        Hello world
      </div>
    );
  },
})
