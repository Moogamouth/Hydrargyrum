function isElementVisible(element) {
  const style = getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
}

function extractReadableTextFromShadowRoot(shadowRoot) {
  let readableText = "";

  function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const parent = node.parentElement;
          if (parent && isElementVisible(parent)) {
              readableText += node.textContent.trim() + "\n";
          }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.shadowRoot) {
              readableText += extractReadableTextFromShadowRoot(node.shadowRoot);
              observe(node.shadowRoot);
          }

          node.childNodes.forEach(processNode);
      }
  }

  shadowRoot.childNodes.forEach(processNode);
  return readableText;
}

function extractFromShadowRoots() {
  let allReadableText = ""

  document.querySelectorAll('*').forEach(element => {
      if (element.shadowRoot) {
          allReadableText += extractReadableTextFromShadowRoot(element.shadowRoot);
          observe(element.shadowRoot);
      }
  });

  return allReadableText.toLowerCase();
}

function filter() {
  const bodyText = (window.location.href + " " + document.title + " " + document.body.innerText + " " + extractFromShadowRoots()).toLowerCase();

  let matchCount = 0;
  const keywordSet = new Set(keywords);

  for (let keyword of keywordSet) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = bodyText.match(regex);
      if (matches) {
          matchCount += matches.length;
      }
  }

  if (matchCount > 3) {
    window.location.href = "about:blank";
  }
}

function observe(el) {
  if (!observerTargets.includes(el)) {
      const observer = new MutationObserver(() => throttle());
      observer.observe(el, { childList: true, subtree: true, characterData: true });
      observerTargets.push(el);
  }
}

function throttle() {
  const checkCondition = setInterval(() => {
      if (Date.now() - time > 500) {
          clearInterval(checkCondition);
          filter();
          time = Date.now();
      }
  }, 100);
}

let time = Date.now();
let observerTargets = [];
let keywords = ["2g1c", "2 girls 1 cup", "acrotomophilia", "alabama hot pocket", "alaskan pipeline", "anilingus", "assmunch", "auto erotic", "autoerotic", "babeland", "baby batter", "baby juice", "ball gag", "ball gravy", "ball kicking", "ball licking", "ball sack", "ball sucking", "bangbros", "bangbus", "bareback", "barely legal", "bbw", "bdsm", "beaver cleaver", "beaver lips", "beastiality", "bestiality", "big black", "big breasts", "big knockers", "big tits", "birdlock", "black cock", "blonde action", "blonde on blonde action", "blowjob", "blow job", "blow your load", "blue waffle", "blumpkin", "boner", "booty call", "brown showers", "brunette action", "bukkake", "bulldyke", "bullet vibe", "bung hole", "bunghole", "busty", "camel toe", "camgirl", "camslut", "camwhore", "carpet muncher", "carpetmuncher", "chocolate rosebuds", "cialis", "cleveland steamer", "clit", "clitoris", "clover clamps", "cock", "cocks", "coprolagnia", "coprophilia", "creampie", "cum", "cumming", "cumshot", "cumshots", "cunnilingus", "cunt", "deep throat", "deepthroat", "dendrophilia", "dildo", "dingleberry", "dingleberries", "dirty pillows", "dirty sanchez", "doggie style", "doggiestyle", "doggy style", "doggystyle", "dog style", "dolcett", "dominatrix", "dommes", "donkey punch", "double dong", "double penetration", "dp action", "dry hump", "dvda", "eat my ass", "ecchi", "ejaculation", "erotic", "erotism", "felch", "fellatio", "feltch", "female squirting", "femdom", "figging", "fingerbang", "fingering", "fisting", "foot fetish", "footjob", "frotting", "fuck buttons", "fudge packer", "fudgepacker", "futanari", "gangbang", "gang bang", "gay sex", "genitals", "giant cock", "girl on", "girl on top", "girls gone wild", "goatcx", "goatse", "gokkun", "golden shower", "goodpoop", "goo girl", "goregasm", "grope", "group sex", "g-spot", "guro", "hand job", "handjob", "hard core", "hardcore", "hentai", "homoerotic", "hooker", "horny", "hot carl", "hot chick", "huge fat", "humping", "incest", "jack off", "jail bait", "jailbait", "jelly donut", "jerk off", "jizz", "juggs", "kinbaku", "kinkster", "kinky", "knobbing", "leather restraint", "leather straight jacket", "lemon party", "livesex", "lolita", "lovemaking", "make me come", "male squirting", "masturbate", "masturbating", "masturbation", "menage a trois", "milf", "missionary position", "mound of venus", "mr hands", "muff diver", "muffdiving", "nawashi", "nimphomania", "nipple", "nipples", "nsfw", "nsfw images", "nude", "nudity", "nutten", "nympho", "nymphomania", "octopussy", "omorashi", "one cup two girls", "one guy one jar", "orgasm", "orgy", "panties", "panty", "pegging", "penis", "phone sex", "piss pig", "pisspig", "playboy", "pleasure chest", "pole smoker", "ponyplay", "poon", "poontang", "punany", "poop chute", "poopchute", "porn", "porno", "pornography", "prince albert piercing", "pthc", "pubes", "queaf", "queef", "quim", "raging boner", "rectum", "reverse cowgirl", "rimjob", "rimming", "rosy palm", "rosy palm and her 5 sisters", "rusty trombone", "sadism", "santorum", "scat", "schlong", "scissoring", "semen", "sexcam", "shaved beaver", "shaved pussy", "shemale", "shibari", "shota", "shrimping", "skeet", "slut", "s&m", "smut", "snowballing", "sodomize", "splooge", "splooge moose", "spooge", "spread legs", "spunk", "strap on", "strapon", "strappado", "strip club", "style doggy", "suicide girls", "sultry women", "swinger", "tea bagging", "threesome", "throating", "thumbzilla", "tied up", "tight white", "tit", "tits", "titties", "titty", "tongue in a", "topless", "tosser", "tranny", "tribadism", "tub girl", "tubgirl", "twat", "twink", "twinkie", "two girls one cup", "undressing", "upskirt", "urethra play", "urophilia", "vagina", "venus mound", "viagra", "vibrator", "violet wand", "vorarephilia", "voyeur", "voyeurweb", "voyuer", "vulva", "wank", "wet dream", "whore", "worldsex", "wrapping men", "wrinkled starfish", "xx", "xxx", "yaoi", "yellow showers", "yiffy", "zoophilia"];

(function() {
  'use strict';
  filter();
  observe(document.body);
})();
