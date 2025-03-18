import React from 'react'
import formilyDevPanel from 'url:./devPanels/formily/index.html'

chrome.devtools.panels.create('Formily', null, formilyDevPanel.split('/').pop())

const IndexDevtools = () => <h2>Formily devtools is running</h2>

export default IndexDevtools
