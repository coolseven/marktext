import path from 'path'

// help functions
const getId = () => {
  const prefix = 'ag-'
  return `${prefix}${Math.random().toString(32).slice(2)}`
}

const easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

/**
 * get unique id base on a set.
 */
export const getUniqueId = set => {
  let id

  do {
    id = getId()
  } while (set.has(id))
  set.add(id)

  return id
}

export const isMetaKey = event => {
  const key = event.key
  return key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta'
}

export const noop = () => {}

export const getIdWithoutSet = () => {
  return `${getId()}-${+new Date()}`
}

export const isOdd = number => Math.abs(number) % 2 === 1
export const isEven = number => Math.abs(number) % 2 === 0

export const isLengthEven = (str = '') => {
  const len = str.length
  return len % 2 === 0
}
/**
 *  Are two arrays have intersection
 */
export const conflict = (arr1, arr2) => {
  return !(arr1[1] < arr2[0] || arr2[1] < arr1[0])
}

export const union = ({ start: tStart, end: tEnd }, { start: lStart, end: lEnd, active }) => {
  if (!(tEnd <= lStart || lEnd <= tStart)) {
    if (lStart < tStart) {
      return {
        start: tStart,
        end: tEnd < lEnd ? tEnd : lEnd,
        active
      }
    } else {
      return {
        start: lStart,
        end: tEnd < lEnd ? tEnd : lEnd,
        active
      }
    }
  }
  return null
}

// https://github.com/jashkenas/underscore
export const throttle = (func, wait = 50) => {
  let context
  let args
  let result
  let timeout = null
  let previous = 0
  const later = () => {
    previous = Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      context = args = null
    }
  }

  return function () {
    const now = Date.now()
    const remaining = wait - (now - previous)

    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = args = null
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
// simple implementation...
export const debounce = (func, wait = 50) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export const deepCopyArray = array => {
  const result = []
  const len = array.length
  let i
  for (i = 0; i < len; i++) {
    if (typeof array[i] === 'object' && array[i] !== null) {
      if (Array.isArray(array[i])) {
        result.push(deepCopyArray(array[i]))
      } else {
        result.push(deepCopy(array[i]))
      }
    } else {
      result.push(array[i])
    }
  }
  return result
}

export const deepCopy = object => {
  // return JSON.parse(JSON.stringify(object))
  const obj = {}
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object' && object[key] !== null) {
      if (Array.isArray(object[key])) {
        obj[key] = deepCopyArray(object[key])
      } else {
        obj[key] = deepCopy(object[key])
      }
    } else {
      obj[key] = object[key]
    }
  })
  return obj
}

export const loadImage = url => {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(url)
    }
    image.onerror = err => {
      reject(err)
    }
    image.src = url
  })
}

export const collectImportantComments = css => {
  const once = new Set()
  const cleaned = css.replace(/(\/\*![\s\S]*?\*\/)\n*/gm, (match, p1) => {
    once.add(p1)
    return ''
  })
  const combined = Array.from(once)
  combined.push(cleaned)
  return combined.join('\n')
}

export const getImageSrc = src => {
  const EXT_REG = /\.(jpeg|jpg|png|gif|svg|webp)(?=\?|$)/i
  const HTTP_REG = /^http(s)?:/
  if (EXT_REG.test(src)) {
    return (HTTP_REG.test(src) || !window.__dirname)
      ? src
      : 'file://' + path.resolve(window.__dirname, src)
  } else {
    return ''
  }
}

export const animatedScrollTo = function (element, to, duration, callback) {
  let start = element.scrollTop
  let change = to - start
  let animationStart = +new Date()
  let animating = true
  let lastpos = null

  const animateScroll = function () {
    if (!animating) {
      return
    }
    requestAnimationFrame(animateScroll)
    const now = +new Date()
    const val = Math.floor(easeInOutQuad(now - animationStart, start, change, duration))
    if (lastpos) {
      if (lastpos === element.scrollTop) {
        lastpos = val
        element.scrollTop = val
      } else {
        animating = false
      }
    } else {
      lastpos = val
      element.scrollTop = val
    }
    if (now > animationStart + duration) {
      element.scrollTop = to
      animating = false
      if (callback) {
        callback()
      }
    }
  }
  requestAnimationFrame(animateScroll)
}

/**
 * [genUpper2LowerKeyHash generate constants map hash, the value is lowercase of the key,
 * also translate `_` to `-`]
 */
export const genUpper2LowerKeyHash = keys => {
  return keys.reduce((acc, key) => {
    const value = key.toLowerCase().replace(/_/g, '-')
    return Object.assign(acc, { [key]: value })
  }, {})
}

/**
 * generate constants map, the value is the key.
 */
export const generateKeyHash = keys => {
  return keys.reduce((acc, key) => {
    return Object.assign(acc, { [key]: key })
  }, {})
}
