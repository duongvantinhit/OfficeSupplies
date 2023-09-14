using NUnit.Framework;

namespace OS.Core.Testing.UnitTest
{
    public class Calculator
    {
        public int AddNumbers(int a, int b)
        {
            return a + b;
        }
    }

    [TestFixture]
    public class Testing
    {
        [Test]
        public void AddNumbers_AddTwoIntegers_ReturnsSum()
        {
            // Arrange
            Calculator calculator = new Calculator();

            // Act
            int result = calculator.AddNumbers(2, 3);

            // Assert
            Assert.AreEqual(5, result);
        }
    }
}
