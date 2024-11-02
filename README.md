# risk tree

A tool for making probability guesstimates, inspired by [a blog post of John Quiggan's](https://johnquiggin.com/2024/10/28/the-end-of-us-democracy-a-flowchart/) and [nomnoml](https://www.nomnoml.com/).

Sometimes you want to know how likely something is, but you don't have any data. The best you can do is to form an educated guess. But you don't have to do that right off! 

It's often easier to estimate probabilities of events which are causally upstream of whatever you're interested in than the thing itself. You can form a more reliable guesstimate using a decision tree and a little bit of math.

## Syntax

Use square brackets to declare events, curly braces to declare choices, and arrows to declare pathways.

```
{a choice} >|a path: prob| [a state]
```

Path labels and/or probabilities may be omitted, e.g.

```
{a choice} >|: prob| [a state]
```

## Limitations

The graph should not include multiple convergent paths with separate root nodes. If you create a graph like this, you will end up with leaf nodes having greater than 100% probability.