import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

export async function GET() {
  try {
    const inventory = db.getInventory();
    return NextResponse.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, arabicName, category, currentStock, minStock, maxStock, unit, cost, price, supplier } = body;

    const newItem = db.addInventoryItem({
      name,
      arabicName,
      category,
      currentStock: currentStock || 0,
      minStock: minStock || 0,
      maxStock: maxStock || 0,
      unit: unit || 'piece',
      cost: cost || 0,
      price: price || 0,
      supplier: supplier || '',
      lastRestocked: new Date()
    });

    return NextResponse.json({
      success: true,
      data: newItem
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedItem = db.updateInventoryItem(id, updateData);

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }

    const success = db.deleteInventoryItem(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
