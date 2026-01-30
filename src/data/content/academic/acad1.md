Graduate research project focused on optimizing the LLVM backend for RISC-V processors.

Research Question:
Can we improve code generation efficiency for RISC-V by implementing custom instruction selection patterns and register allocation strategies?

Methodology:
• Analyzed existing LLVM RISC-V backend
• Identified optimization opportunities
• Implemented custom instruction patterns
• Benchmarked against standard compilation

Results:
Achieved 15% improvement in code size and 8% improvement in execution time on average across standard benchmarks (SPEC CPU2017).

Key Contributions:
1. Novel instruction selection patterns for common idioms
2. Improved register allocation heuristics
3. Better handling of immediate constants
4. Documentation and test suite

This work was presented at the LLVM Developers' Meeting and has been partially upstreamed to the official LLVM repository.