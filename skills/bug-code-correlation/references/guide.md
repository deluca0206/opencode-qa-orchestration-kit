# Causal method
Start with the endpoint or event demonstrated by the EV. Locate route
registration, component binding and the invoked handler. Read each excerpt before
citing it. Identify the predicate separating expected from observed behavior:
empty input, missing state, unhandled error, authorization or transformation.

If the handler merely displays an error from another service, do not name it the
root cause. Seek the preceding condition and state where evidence ends. When two
hypotheses explain the same EV, propose a test that gives different results for
them. Example: invalid payload versus expired session requires comparing the
response with valid input and the same synthetic identity, not merely retrying.

Without runtime access, the condition is a code fact, but its involvement in the
incident remains a hypothesis. Without reading, correlation is not complete.
