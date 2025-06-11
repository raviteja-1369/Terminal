module top;
  clock_gen U1 (.clk(sys_clk), .rst(1'b0));
  adder #(.WIDTH(32)) add1 (a, b, sum);
endmodule
